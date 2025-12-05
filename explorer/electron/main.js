import { ipcMain } from 'electron'
import { initExplorerWindow, openExplorerWindow } from './helpers/index.js'
import * as events from './events/index.js'

export default (mainWindow) => {
  // 存储每个设备的文件管理器窗口
  const explorerWindows = new Map()

  ipcMain.handle('open-explorer-window', (event, data) => {
    const deviceId = data?.id

    // 检查是否已经存在该设备的文件管理器窗口
    let explorerWindow = explorerWindows.get(deviceId)

    if (explorerWindow && !explorerWindow.isDestroyed()) {
      // 如果窗口已存在，直接显示并更新数据
      openExplorerWindow(explorerWindow, data)
      return false
    }

    // 创建新的文件管理器窗口
    explorerWindow = initExplorerWindow(mainWindow, data)

    events.install(explorerWindow)

    // 存储窗口引用
    explorerWindows.set(deviceId, explorerWindow)

    // 窗口关闭时清理引用
    explorerWindow.on('closed', () => {
      explorerWindows.delete(deviceId)
    })

    ipcMain.on('explorer-mounted', () => {
      openExplorerWindow(explorerWindow, data)
    })

    return true
  })

  ipcMain.handle('close-explorer-window', (event, data) => {
    const deviceId = data?.id
    const explorerWindow = explorerWindows.get(deviceId)

    if (explorerWindow && !explorerWindow.isDestroyed()) {
      explorerWindow.close()
      explorerWindows.delete(deviceId)
    }
  })
}
