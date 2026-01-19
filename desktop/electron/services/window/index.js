import { BrowserWindow } from 'electron'
import { ipcxMain } from '@escrcpy/electron-ipcx/main'

export default () => {
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
}
