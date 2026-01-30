import { devPublishPath } from '$electron/configs/index.js'
import { is } from '@electron-toolkit/utils'
import { app, ipcMain } from 'electron'
import electronUpdater from 'electron-updater'

const { autoUpdater } = electronUpdater

export default {
  name: 'service:updater',
  apply(mainApp) {
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
      const mainWindow = mainApp.getMainWindow()
      mainWindow?.webContents?.send('update-error', error)
    })

    // Checking for updates
    autoUpdater.on('checking-for-update', (ret) => {
      console.log('checking-for-update', ret)
    })

    // Update available
    autoUpdater.on('update-available', (ret) => {
      const mainWindow = mainApp.getMainWindow()
      mainWindow?.webContents?.send('update-available', ret)
    })

    // When no update is available
    autoUpdater.on('update-not-available', (ret) => {
      const mainWindow = mainApp.getMainWindow()
      mainWindow?.webContents?.send('update-not-available', ret)
    })

    // Download progress
    autoUpdater.on('download-progress', (ret) => {
      const mainWindow = mainApp.getMainWindow()
      mainWindow?.webContents?.send('download-progress', ret)
    })

    // After the update package has been downloaded
    autoUpdater.on('update-downloaded', (ret) => {
      const mainWindow = mainApp.getMainWindow()
      mainWindow?.webContents?.send('update-downloaded', ret)
    })
  },
}
