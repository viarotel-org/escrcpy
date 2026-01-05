import { ipcRenderer as electronIpcRenderer, type IpcRenderer as ElectronIpcRenderer, type IpcRendererEvent } from 'electron'
import { getByPath } from '../shared/paths'
import { serializeArgs } from '../shared/serialize'
import { exposeClassAPI } from '../shared/expose'
import type { InvokeEnvelope, InvokeHandle } from '../shared/types'
import { prepareInboundArgs } from '../shared/validators'
import { unwrapError, safeCall, createCallbackError } from '../shared/errors'
import { debugLogger } from '../shared/debug'
import { SimpleChannelGenerator } from '../shared/channel-pool'

/**
 * Renderer-side IPC extension that enables function arguments by proxying callbacks through unique channels.
 */
export class IpcxRenderer {
  private readonly ipc: ElectronIpcRenderer
  private readonly channelGenerator: SimpleChannelGenerator

  constructor(ipc: ElectronIpcRenderer = electronIpcRenderer) {
    this.ipc = ipc
    this.channelGenerator = new SimpleChannelGenerator('ipcx_fn')
  }

  /**
   * Mirror of ipcRenderer.invoke with automatic callback disposal after the promise settles.
   */
  invoke<T = unknown>(channel: string, ...args: unknown[]): Promise<T> {
    debugLogger.debug('Invoking channel', { channel, direction: 'send', argsCount: args.length })
    
    const { envelope, dispose } = this.preparePayload(channel, args)
    const promise = (async () => {
      try {
        const result = await this.ipc.invoke(channel, envelope)
        debugLogger.debug('Invoke completed', { channel })
        return unwrapError(result)
      }
      catch (error) {
        debugLogger.error('Invoke failed', { channel, error })
        throw error
      }
      finally {
        dispose()
      }
    })()

    return promise
  }

  /**
   * Invoke with manual lifecycle control. Caller must call dispose to remove temporary listeners.
   */
  invokeRetained<T = unknown>(channel: string, ...args: unknown[]): InvokeHandle<T> {
    debugLogger.debug('Invoking channel (retained)', { channel, direction: 'send', argsCount: args.length })
    
    const { envelope, dispose } = this.preparePayload(channel, args)
    const promise = (async () => {
      try {
        const result = await this.ipc.invoke(channel, envelope)
        return unwrapError(result)
      }
      catch (error) {
        debugLogger.error('Retained invoke failed', { channel, error })
        throw error
      }
    })()

    return { promise, dispose }
  }

  /**
   * Fire-and-forget send with function lifting.
   */
  send(channel: string, ...args: unknown[]): void {
    debugLogger.debug('Sending to channel', { channel, direction: 'send', argsCount: args.length })
    
    const { envelope, dispose } = this.preparePayload(channel, args)
    try {
      this.ipc.send(channel, envelope)
    }
    catch (error) {
      debugLogger.error('Send failed', { channel, error })
      throw error
    }
    finally {
      dispose()
    }
  }

  on(channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void): () => void {
    debugLogger.info('Registering listener', { channel })
    
    const wrapped = (event: IpcRendererEvent, payload: unknown, ...rest: unknown[]) => {
      try {
        const args = prepareInboundArgs(payload, rest)
        
        debugLogger.debug('Listener invoked', {
          channel,
          direction: 'receive',
          argsCount: args.length,
        })
        
        safeCall(() => listener(event, ...args), `listener on ${channel}`)
      }
      catch (error) {
        debugLogger.error('Listener hydration error', { channel, error })
      }
    }

    this.ipc.on(channel, wrapped)
    return () => {
      debugLogger.debug('Removing listener', { channel })
      this.ipc.removeListener(channel, wrapped)
    }
  }

  once(channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void): () => void {
    const disposer = this.on(channel, (event, ...args) => {
      disposer()
      listener(event, ...args)
    })
    return disposer
  }

  off(channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void): void {
    debugLogger.debug('Removing listener (off)', { channel })
    this.ipc.removeListener(channel, listener)
  }

  private preparePayload(channel: string, args: unknown[]): {
    envelope: InvokeEnvelope
    dispose: () => void
  } {
    const baseChannel = this.channelGenerator.generate()
    
    const { sanitizedArgs, descriptors } = serializeArgs(args, baseChannel)

    debugLogger.debug('Payload prepared', {
      channel,
      argsCount: sanitizedArgs.length,
      functionsExtracted: descriptors.length,
    })

    const disposers: Array<() => void> = []

    descriptors.forEach((descriptor) => {
      const handler = (_event: unknown, ...callArgs: unknown[]) => {
        const target = getByPath(args, descriptor.segments)
        if (typeof target !== 'function') {
          debugLogger.warn('Callback target is not a function', {
            channel,
            callback: descriptor.index,
          })
          return
        }
        
        try {
          debugLogger.debug('Executing callback', {
            channel,
            callback: descriptor.index,
            argsCount: callArgs.length,
          })
          
          target(...callArgs)
        }
        catch (error) {
          const callbackError = createCallbackError(descriptor.index, error)
          debugLogger.error('Callback execution failed', {
            channel,
            callback: descriptor.index,
            error: callbackError,
          })
        }
      }

      this.ipc.on(descriptor.channel, handler)
      disposers.push(() => this.ipc.removeListener(descriptor.channel, handler))
    })

    let disposed = false
    const dispose = () => {
      if (disposed) return
      disposed = true
      
      debugLogger.debug('Disposing callback listeners', {
        channel,
        count: disposers.length,
      })
      
      disposers.splice(0).forEach((fn) => fn())
    }

    const envelope: InvokeEnvelope = {
      args: sanitizedArgs,
      fns: descriptors,
    }

    return { envelope, dispose }
  }

}

export const ipcxRenderer = exposeClassAPI(IpcxRenderer)