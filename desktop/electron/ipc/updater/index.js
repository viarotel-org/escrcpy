import { devPublishPath } from '$electron/configs/index.js'
import { is } from '@electron-toolkit/utils'
import { app, ipcMain } from 'electron'
import electronUpdater from 'electron-updater'

const { autoUpdater } = electronUpdater

export default (mainWindow) => {
  if (is.dev) {
    autoUpdater.updateConfigPath = devPublishPath
    Object.defineProperty(app, 'isPackaged', {
      get() {
        return true
      },
    })
  }

  // Trigger update check (intended to be called from the renderer, e.g. when user clicks "check for updates")
  ipcMain.on('check-for-update', () => {
    autoUpdater.checkForUpdates()
  })

  // Download update
  ipcMain.on('download-update', () => {
    autoUpdater.downloadUpdate()
  })

  // Install update
  ipcMain.on('quit-and-install', () => {
    setImmediate(() => {
      app.isQuiting = true
      autoUpdater.quitAndInstall()
    })
  })

  // Set auto-download to false (default true — automatically download when updates are found)
  autoUpdater.autoDownload = false
  // Handle update errors
  autoUpdater.on('error', (error) => {
    console.error('update-error')
    mainWindow.webContents.send('update-error', error)
  })

  // Checking for updates
  autoUpdater.on('checking-for-update', (ret) => {
    console.log('checking-for-update', ret)
  })

  // Update available
  autoUpdater.on('update-available', (ret) => {
    mainWindow.webContents.send('update-available', ret)
  })

  // 检测到不需要更新时
  autoUpdater.on('update-not-available', (ret) => {
    mainWindow.webContents.send('update-not-available', ret)
  })

  // Download progress
  autoUpdater.on('download-progress', (ret) => {
    mainWindow.webContents.send('download-progress', ret)
  })

  // 当需要更新的内容下载完成后
  autoUpdater.on('update-downloaded', (ret) => {
    mainWindow.webContents.send('update-downloaded', ret)
  })
}
