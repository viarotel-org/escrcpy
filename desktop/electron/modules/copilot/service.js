import { ipcMain } from 'electron'
import { isWindowDestroyed } from '$electron/helpers/index.js'
import { registerCopilotHandlers, unregisterCopilotHandlers } from './services/handlers.js'
import { installWindowEvents } from './events.js'

export default (app) => {
  registerCopilotHandlers()

  const manager = app.getWindowManager('copilot')
  if (!manager) {
    return
  }

  ipcMain.handle('open-copilot-window', (_event, data) => {
    const deviceId = data?.device?.id || data?.id

    if (!deviceId) {
      console.error('Device ID is required to open Copilot window')
      return false
    }

    let copilotWindow = manager.get(deviceId)

    if (!isWindowDestroyed(copilotWindow)) {
      copilotWindow.webContents.send('device-change', data)
      copilotWindow.show()
      copilotWindow.focus()
      return false
    }

    copilotWindow = manager.open({
      payload: {
        id: deviceId,
        name: data?.device?.name || data?.name,
        remark: data?.device?.remark || data?.remark,
      },
      show: false,
      instanceId: deviceId,
    })

    if (!copilotWindow) {
      return false
    }

    installWindowEvents(copilotWindow)

    copilotWindow.on('closed', () => {
      copilotWindow = void 0
    })

    copilotWindow.show()

    return true
  })

  ipcMain.handle('close-copilot-window', (_event, data) => {
    const deviceId = data?.device?.id || data?.id

    if (!deviceId) {
      return false
    }

    const targetWindow = manager.get(deviceId)

    if (isWindowDestroyed(targetWindow)) {
      return false
    }

    targetWindow.close()

    return true
  })

  ipcMain.handle('close-all-copilot-windows', () => {
    manager.getAll().forEach((window) => {
      if (!isWindowDestroyed(window)) {
        window.close()
      }
    })
    return true
  })

  return () => {
    unregisterCopilotHandlers()
    ipcMain.removeHandler('open-copilot-window')
    ipcMain.removeHandler('close-copilot-window')
    ipcMain.removeHandler('close-all-copilot-windows')
  }
}
