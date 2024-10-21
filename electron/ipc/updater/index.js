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

  // 触发检查更新(此方法用于被渲染线程调用，例如页面点击检查更新按钮来调用此方法)
  ipcMain.on('check-for-update', () => {
    autoUpdater.checkForUpdates()
  })

  // 下载更新
  ipcMain.on('download-update', () => {
    autoUpdater.downloadUpdate()
  })

  // 安装更新
  ipcMain.on('quit-and-install', () => {
    setImmediate(() => {
      app.isQuiting = true
      autoUpdater.quitAndInstall()
    })
  })

  // 设置自动下载为false(默认为true，检测到有更新就自动下载)
  autoUpdater.autoDownload = false
  // 检测下载错误
  autoUpdater.on('error', (error) => {
    console.error('update-error')
    mainWindow.webContents.send('update-error', error)
  })

  // 检测是否需要更新
  autoUpdater.on('checking-for-update', (ret) => {
    console.log('checking-for-update', ret)
  })

  // 检测到可以更新时
  autoUpdater.on('update-available', (ret) => {
    mainWindow.webContents.send('update-available', ret)
  })

  // 检测到不需要更新时
  autoUpdater.on('update-not-available', (ret) => {
    mainWindow.webContents.send('update-not-available', ret)
  })

  // 更新下载进度
  autoUpdater.on('download-progress', (ret) => {
    mainWindow.webContents.send('download-progress', ret)
  })

  // 当需要更新的内容下载完成后
  autoUpdater.on('update-downloaded', (ret) => {
    mainWindow.webContents.send('update-downloaded', ret)
  })
}
