import { ipcMain } from 'electron'
import { initCopilotWindow } from './helpers/index.js'
import { isWindowDestroyed } from '$electron/helpers/index.js'
import { registerCopilotHandlers } from './services/handlers.js'
import * as events from './events/index.js'

export default (mainWindow) => {
  registerCopilotHandlers(mainWindow)

  const copilotWindows = new Map()

  ipcMain.handle('open-copilot-window', (event, data) => {
    const deviceId = data?.device?.id || data?.id

    if (!deviceId) {
      console.error('Device ID is required to open Copilot window')
      return false
    }

    let copilotWindow = copilotWindows.get(deviceId)

    if (!isWindowDestroyed(copilotWindow)) {
      copilotWindow.webContents.send('device-change', data)
      copilotWindow.show()
      copilotWindow.focus()
      return false
    }

    copilotWindow = initCopilotWindow(mainWindow, {
      id: deviceId,
      name: data?.device?.name || data?.name,
      remark: data?.device?.remark || data?.remark,
    })

    events.install(copilotWindow)

    copilotWindows.set(deviceId, copilotWindow)

    copilotWindow.on('closed', () => {
      copilotWindows.delete(deviceId)
      copilotWindow = void 0
    })

    copilotWindow.show()

    return true
  })

  ipcMain.handle('close-copilot-window', (event, data) => {
    const deviceId = data?.device?.id || data?.id

    if (!deviceId) {
      return false
    }

    const copilotWindow = copilotWindows.get(deviceId)

    if (isWindowDestroyed(copilotWindow)) {
      return false
    }

    copilotWindow.close()
    copilotWindows.delete(deviceId)

    return true
  })

  ipcMain.handle('close-all-copilot-windows', () => {
    copilotWindows.forEach((window, key) => {
      if (!isWindowDestroyed(window)) {
        window.close()
      }
    })
    copilotWindows.clear()
    return true
  })
}
