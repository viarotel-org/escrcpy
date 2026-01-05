import { ipcMain } from 'electron'
import { initCopilotWindow } from './helpers/index.js'
import { isWindowDestroyed } from '$electron/helpers/index.js'
import { registerCopilotHandlers } from './services/handlers.js'
import * as events from './events/index.js'

export default (mainWindow) => {
  registerCopilotHandlers(mainWindow)

  // 存储每个设备的 Copilot 窗口
  // key: deviceId (单例模式 - 每个设备只有一个窗口)
  const copilotWindows = new Map()

  ipcMain.handle('open-copilot-window', (event, data) => {
    const deviceId = data?.device?.id || data?.id

    if (!deviceId) {
      console.error('Device ID is required to open Copilot window')
      return false
    }

    // 检查是否已经存在该设备的 Copilot 窗口
    let copilotWindow = copilotWindows.get(deviceId)

    if (!isWindowDestroyed(copilotWindow)) {
      // 窗口已存在，更新设备信息并显示
      copilotWindow.webContents.send('device-change', data)
      copilotWindow.show()
      copilotWindow.focus()
      return false
    }

    // 创建新的 Copilot 窗口
    copilotWindow = initCopilotWindow(mainWindow, {
      id: deviceId,
      name: data?.device?.name || data?.name,
      remark: data?.device?.remark || data?.remark,
    })

    events.install(copilotWindow)

    // 存储窗口引用
    copilotWindows.set(deviceId, copilotWindow)

    // 窗口关闭时清理引用
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

  // 关闭所有 Copilot 窗口
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
