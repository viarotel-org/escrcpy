import { ipcMain as electronIpcMain } from 'electron'
import type { IpcMain as ElectronIpcMain, IpcMainEvent, IpcMainInvokeEvent, WebContents } from 'electron'
import { clonePayload } from '../shared/clone'
import { setByPath } from '../shared/paths'
import { isInvokeEnvelope, normalizeEnvelope, prepareInboundArgs } from '../shared/validators'
import { safeCall, wrapError } from '../shared/errors'
import { debugLogger } from '../shared/debug'

/**
 * Main-process IPC extension that reconstructs function proxies for incoming invokes.
 */
export class IpcxMain {
  private readonly ipc: ElectronIpcMain

  constructor(ipc: ElectronIpcMain = electronIpcMain) {
    this.ipc = ipc
  }

  private hydratePayload(
    event: IpcMainInvokeEvent | IpcMainEvent,
    payload: unknown,
    channel?: string,
  ): unknown[] {
    const envelope = normalizeEnvelope(payload, channel)
    const args = clonePayload(envelope.args)

    debugLogger.debug('Hydrating payload', {
      channel,
      argsCount: envelope.args.length,
      fnsCount: envelope.fns.length,
    })

    envelope.fns.forEach((descriptor) => {
      const proxy = (...cbArgs: unknown[]) => {
        if (!event.sender || (event.sender.isDestroyed && event.sender.isDestroyed())) {
          debugLogger.error('Sender missing or destroyed for callback', {
            channel,
            callback: descriptor.index,
          })
          return
        }

        debugLogger.debug('Executing callback proxy', {
          channel,
          callback: descriptor.index,
          argsCount: cbArgs.length,
        })

        safeCall(
          () => event.sender.send(descriptor.channel, ...cbArgs),
          `callback ${descriptor.index}`,
        )
      }

      setByPath(args, descriptor.segments, proxy)
    })

    return args as unknown[]
  }

  private safeHydrate(
    event: IpcMainEvent,
    payload: unknown,
    rest: unknown[],
    channel?: string,
  ): unknown[] {
    if (isInvokeEnvelope(payload)) {
      debugLogger.debugPayloadDetection(channel || 'unknown', payload, true)
      return this.hydratePayload(event, payload, channel)
    }

    debugLogger.debugPayloadDetection(channel || 'unknown', payload, false)
    return prepareInboundArgs(payload, rest)
  }

  handle(
    channel: string,
    listener: (event: IpcMainInvokeEvent, ...args: any[]) => unknown | Promise<unknown>,
  ) {
    debugLogger.info('Registering handler', { channel })

    return this.ipc.handle(channel, async (event, payload: unknown) => {
      try {
        const isIpcx = isInvokeEnvelope(payload)

        debugLogger.debug('Handler invoked', {
          channel,
          direction: 'receive',
          isIpcxFormat: isIpcx,
        })

        let args: unknown[]

        if (isIpcx) {
          args = this.hydratePayload(event, payload, channel)
        }
        else {
          debugLogger.warn('Non-IPCX payload detected, using fallback mode', {
            channel,
            payloadType: typeof payload,
          })

          args = typeof payload === 'undefined' ? [] : [payload]
        }

        const result = await listener(event, ...args)

        debugLogger.debug('Handler completed', { channel })

        return result
      }
      catch (error) {
        debugLogger.error('Handler error', { channel, error })
        return wrapError(error)
      }
    })
  }

  removeHandler(channel: string) {
    debugLogger.info('Removing handler', { channel })
    this.ipc.removeHandler(channel)
  }

  on(channel: string, listener: (event: IpcMainEvent, ...args: unknown[]) => void): () => void {
    debugLogger.info('Registering listener', { channel })

    const wrapped = (event: IpcMainEvent, payload: unknown, ...rest: unknown[]) => {
      try {
        const args = this.safeHydrate(event, payload, rest, channel)
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

  once(channel: string, listener: (event: IpcMainEvent, ...args: unknown[]) => void): () => void {
    const disposer = this.on(channel, (event, ...args) => {
      disposer()
      listener(event, ...args)
    })
    return disposer
  }

  off(channel: string, listener: (event: IpcMainEvent, ...args: unknown[]) => void): void {
    debugLogger.debug('Removing listener (off)', { channel })
    this.ipc.removeListener(channel, listener)
  }

  sendTo(webContents: WebContents, channel: string, ...args: unknown[]) {
    debugLogger.debug('Sending to webContents', { channel, argsCount: args.length })

    if (webContents.isDestroyed && webContents.isDestroyed()) {
      debugLogger.warn('Cannot send to destroyed webContents', { channel })
      return
    }

    webContents.send(channel, ...args)
  }
}

export const ipcxMain = new IpcxMain()
