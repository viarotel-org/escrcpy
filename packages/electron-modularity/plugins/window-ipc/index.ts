import { BrowserWindow } from 'electron'
import type { IpcMainInvokeEvent } from 'electron'
import type { ElectronApp, Plugin } from '../../main/types'
import { ipcxMain } from '@escrcpy/electron-ipcx/main'

/**
 * Window IPC plugin options
 */
export interface WindowIPCPluginOptions {
  /**
   * Custom IPC channel prefix
   * @default 'window'
   */
  channelPrefix?: string

  /**
   * Enable/disable specific handlers
   */
  handlers?: {
    minimize?: boolean
    maximize?: boolean
    close?: boolean
    isMaximized?: boolean
    open?: boolean
    closeById?: boolean
    destroyById?: boolean
    focusById?: boolean
  }
}

/**
 * Window control IPC handlers plugin
 *
 * Provides IPC handlers for window management from renderer process.
 *
 * @example
 * ```ts
 * import { createElectronApp } from '@escrcpy/electron-modularity'
 * import { windowIPCPlugin } from '@escrcpy/electron-modularity/plugins'
 *
 * const app = createElectronApp({ ... })
 *
 * app.use(windowIPCPlugin, {
 *   channelPrefix: 'win',
 *   handlers: {
 *     minimize: true,
 *     maximize: true,
 *     close: true,
 *   }
 * })
 * ```
 */
export const windowIPCPlugin: Plugin<void, WindowIPCPluginOptions> = {
  name: 'plugin:window-ipc',
  priority: 'normal',

  apply(ctx: ElectronApp, options: WindowIPCPluginOptions = {}) {
    const {
      channelPrefix = 'window',
      handlers = {},
    } = options

    const {
      minimize = true,
      maximize = true,
      close = true,
      isMaximized = true,
      open = true,
      closeById = true,
      destroyById = true,
      focusById = true,
    } = handlers

    const channels: string[] = []
    const windowStates = new WeakMap<BrowserWindow, () => void>()

    // Window minimize handler
    if (minimize) {
      const channel = `${channelPrefix}-minimize`
      ipcxMain.handle(channel, (event: IpcMainInvokeEvent) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        if (!win) {
          return false
        }
        win.minimize()
        return true
      })
      channels.push(channel)
    }

    // Window maximize/unmaximize handler
    if (maximize) {
      const channel = `${channelPrefix}-maximize`
      ipcxMain.handle(channel, (event: IpcMainInvokeEvent) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        if (!win) {
          return false
        }
        if (win.isMaximized()) {
          win.unmaximize()
        }
        else {
          win.maximize()
        }
        return true
      })
      channels.push(channel)
    }

    // Window close handler
    if (close) {
      const channel = `${channelPrefix}-close`
      ipcxMain.handle(channel, (event: IpcMainInvokeEvent) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        if (!win) {
          return false
        }
        win.close()
        return true
      })
      channels.push(channel)
    }

    // Window is-maximized state tracker
    if (isMaximized) {
      const channel = `${channelPrefix}-is-maximized`
      ipcxMain.handle(channel, (event: IpcMainInvokeEvent, callback: (state: boolean) => void) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        if (!win) {
          return false
        }

        // Cleanup previous listeners if any
        if (windowStates.has(win)) {
          const dispose = windowStates.get(win)
          dispose?.()
          windowStates.delete(win)
        }

        const onMaximize = () => {
          callback(true)
        }

        const onUnmaximize = () => {
          callback(false)
        }

        windowStates.set(win, () => {
          win.off('maximize', onMaximize)
          win.off('unmaximize', onUnmaximize)
        })

        win.on('maximize', onMaximize)
        win.on('unmaximize', onUnmaximize)

        return callback(win.isMaximized())
      })
      channels.push(channel)
    }

    // Open window by manager ID
    if (open) {
      const channel = `${channelPrefix}-open`
      ipcxMain.handle(channel, (_event: IpcMainInvokeEvent, payload: { id: string, options?: unknown } = { id: '' }) => {
        const { id, options: openOptions } = payload
        if (!id) {
          return false
        }
        const win = ctx.openWindow(id, openOptions)
        return Boolean(win)
      })
      channels.push(channel)
    }

    // Close window by ID
    if (closeById) {
      const channel = `${channelPrefix}-close-by-id`
      ipcxMain.handle(channel, (_event: IpcMainInvokeEvent, payload: { id: string, instanceId?: string } = { id: '' }) => {
        const { id, instanceId } = payload
        if (!id) {
          return false
        }
        const manager = ctx.getWindowManager(id)
        return Boolean(manager?.close({ instanceId }))
      })
      channels.push(channel)
    }

    // Destroy window by ID
    if (destroyById) {
      const channel = `${channelPrefix}-destroy-by-id`
      ipcxMain.handle(channel, (_event: IpcMainInvokeEvent, payload: { id: string, instanceId?: string } = { id: '' }) => {
        const { id, instanceId } = payload
        if (!id) {
          return false
        }
        const manager = ctx.getWindowManager(id)
        return Boolean(manager?.destroy({ instanceId }))
      })
      channels.push(channel)
    }

    // Focus window by ID
    if (focusById) {
      const channel = `${channelPrefix}-focus-by-id`
      ipcxMain.handle(channel, (_event: IpcMainInvokeEvent, payload: { id: string, instanceId?: string } = { id: '' }) => {
        const { id, instanceId } = payload
        if (!id) {
          return false
        }
        const manager = ctx.getWindowManager(id)
        const win = manager?.get(instanceId)
        if (!win || win.isDestroyed()) {
          return false
        }
        win.show()
        win.focus()
        return true
      })
      channels.push(channel)
    }

    // Cleanup function
    const cleanup = () => {
      // Remove all IPC handlers
      channels.forEach(channel => ipcxMain.removeHandler(channel))

      // Cleanup window state listeners
      const states: BrowserWindow[] = []
      // WeakMap doesn't have forEach, need to track windows differently
      // For now, cleanup happens automatically when windows are destroyed
    }

    return cleanup
  },
}

export default windowIPCPlugin
