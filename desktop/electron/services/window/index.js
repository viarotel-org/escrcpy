import { BrowserWindow } from 'electron'
import { ipcxMain } from '@escrcpy/electron-ipcx/main'

export default (appContext) => {
  ipcxMain.handle('window-minimize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)

    if (!win) {
      return false
    }

    win.minimize()
    return true
  })

  ipcxMain.handle('window-maximize', (event) => {
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

  ipcxMain.handle('window-close', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)

    if (!win) {
      return false
    }

    win.close()
    return true
  })

  const windowStates = new WeakMap()

  ipcxMain.handle('window-is-maximized', (event, callback) => {
    const win = BrowserWindow.fromWebContents(event.sender)

    if (!win) {
      return false
    }

    if (windowStates.has(win)) {
      const dispose = windowStates.get(win)
      dispose()
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

    const value = win.isMaximized()

    return callback(value)
  })

  ipcxMain.handle('window-open', (_event, payload = {}) => {
    const { id, options } = payload || {}
    if (!id) {
      return false
    }

    const win = appContext?.openWindow?.(id, options)
    return Boolean(win)
  })

  ipcxMain.handle('window-close-by-id', (_event, payload = {}) => {
    const { id, instanceId } = payload || {}
    if (!id) {
      return false
    }

    const manager = appContext?.getWindowManager?.(id)
    return Boolean(manager?.close?.({ instanceId }))
  })

  ipcxMain.handle('window-destroy-by-id', (_event, payload = {}) => {
    const { id, instanceId } = payload || {}
    if (!id) {
      return false
    }

    const manager = appContext?.getWindowManager?.(id)
    return Boolean(manager?.destroy?.({ instanceId }))
  })

  ipcxMain.handle('window-focus-by-id', (_event, payload = {}) => {
    const { id, instanceId } = payload || {}
    if (!id) {
      return false
    }

    const manager = appContext?.getWindowManager?.(id)
    const win = manager?.get?.(instanceId)
    if (!win || win.isDestroyed?.()) {
      return false
    }

    win.show?.()
    win.focus?.()
    return true
  })
}
