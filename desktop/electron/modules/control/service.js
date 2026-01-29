import { ipcMain } from 'electron'
import { isWindowDestroyed } from '$electron/helpers/index.js'
import events from './events.js'

export default (app) => {
  const manager = app.getWindowManager('control')
  if (!manager) {
    return
  }

  let currentDevice
  let disposeEvents

  const OPEN_HANDLER = 'open-control-window'
  const CLOSE_HANDLER = 'close-control-window'

  ipcMain.handle(OPEN_HANDLER, (_event, data) => {
    currentDevice = data

    let controlWindow = manager.get()
    if (!isWindowDestroyed(controlWindow)) {
      showControlWindow(controlWindow)
      return false
    }

    controlWindow = manager.open({ payload: data, show: false })

    if (!controlWindow) {
      return false
    }

    disposeEvents = events.install(controlWindow)

    const onControlMounted = () => {
      showControlWindow(controlWindow)
    }

    controlWindow.once('closed', () => {
      disposeEvents?.()
      disposeEvents = undefined
      controlWindow = void 0
      currentDevice = void 0
      ipcMain.off('control-mounted', onControlMounted)
    })

    ipcMain.off('control-mounted', onControlMounted)
    ipcMain.on('control-mounted', onControlMounted)

    return true
  })

  ipcMain.handle(CLOSE_HANDLER, () => {
    const controlWindow = manager.get()

    if (!controlWindow) {
      return false
    }

    controlWindow.close()

    return true
  })

  function showControlWindow(controlWindow) {
    if (!controlWindow) {
      return false
    }

    controlWindow.webContents.send('device-change', currentDevice)
    controlWindow.show()
    return true
  }

  return () => {
    ipcMain.removeHandler(OPEN_HANDLER)
    ipcMain.removeHandler(CLOSE_HANDLER)
    ipcMain.removeAllListeners('control-mounted')
    disposeEvents?.()
  }
}
