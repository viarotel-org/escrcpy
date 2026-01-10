import { ipcMain } from 'electron'
import { initCopilotWindow } from './helpers/index.js'
import { isWindowDestroyed } from '$electron/helpers/index.js'
import { registerCopilotHandlers } from './services/handlers.js'
import * as events from './events/index.js'

export default (mainWindow) => {
  registerCopilotHandlers(mainWindow)

  // Store Copilot windows per device
  // key: deviceId (singleton per device)
  const copilotWindows = new Map()

  ipcMain.handle('open-copilot-window', (event, data) => {
    const deviceId = data?.device?.id || data?.id

    if (!deviceId) {
      console.error('Device ID is required to open Copilot window')
      return false
    }

    // Check whether a Copilot window already exists for the device
    let copilotWindow = copilotWindows.get(deviceId)

    if (!isWindowDestroyed(copilotWindow)) {
      // Window exists: update device info and show
      copilotWindow.webContents.send('device-change', data)
      copilotWindow.show()
      copilotWindow.focus()
      return false
    }

    // Create a new Copilot window
    copilotWindow = initCopilotWindow(mainWindow, {
      id: deviceId,
      name: data?.device?.name || data?.name,
      remark: data?.device?.remark || data?.remark,
    })

    events.install(copilotWindow)

    // Store window reference
    copilotWindows.set(deviceId, copilotWindow)

    // Clean up reference on window closed
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

  // Close all Copilot windows
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
