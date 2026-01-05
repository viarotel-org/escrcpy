import { ipcMain } from 'electron'
import { initControlWindow } from './helpers/index.js'
import { isWindowDestroyed } from '$electron/helpers/index.js'
import * as events from './events/index.js'

export default (mainWindow) => {
  let controlWindow
  let currentDevice

  ipcMain.handle('open-control-window', (event, data) => {
    currentDevice = data

    if (!isWindowDestroyed(controlWindow)) {
      showControlWindow()
      return false
    }

    controlWindow = initControlWindow(mainWindow, data)

    events.install(controlWindow)

    const onControlMounted = () => {
      showControlWindow()
    }

    controlWindow.once('closed', () => {
      controlWindow = void 0
      currentDevice = void 0
      ipcMain.off('control-mounted', onControlMounted)
    })

    ipcMain.off('control-mounted', onControlMounted)
    ipcMain.on('control-mounted', onControlMounted)
  })

  ipcMain.handle('close-control-window', () => {
    if (!controlWindow) {
      return false
    }

    controlWindow.close()

    return true
  })

  function showControlWindow() {
    if (!controlWindow) {
      return false
    }

    controlWindow.webContents.send('device-change', currentDevice)
    controlWindow.show()
  }
}
