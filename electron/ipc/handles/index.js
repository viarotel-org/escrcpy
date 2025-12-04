import { app, dialog, ipcMain, screen, shell } from 'electron'
import fs from 'fs-extra'
import path from 'node:path'
import { copyFileToClipboard } from '$electron/helpers/clipboard.js'

export default (mainWindow) => {
  ipcMain.handle(
    'show-open-dialog',
    async (_, { preset = '', ...options } = {}) => {
      const res = await dialog
        .showOpenDialog(options)
        .catch(e => console.warn(e))

      if (res.canceled) {
        throw new Error('User cancel operation')
      }

      if (!res.filePaths.length) {
        throw new Error('Get the directory or file path failure')
      }

      const filePaths = res.filePaths

      switch (preset) {
        case 'replaceFile':
          await fs.copy(filePaths[0], options.filePath, { overwrite: true })
          break
      }

      return filePaths
    },
  )

  ipcMain.handle('open-path', async (_, pathValue) => {
    return shell.openPath(pathValue)
  })

  ipcMain.handle('show-item-in-folder', async (_, filePath) => {
    return shell.showItemInFolder(filePath)
  })

  ipcMain.handle('get-primary-display', async () => {
    const primaryDisplay = screen.getPrimaryDisplay()
    return primaryDisplay
  })

  ipcMain.handle(
    'show-save-dialog',
    async (_, { filePath = '', ...options } = {}) => {
      const res = await dialog
        .showSaveDialog({
          ...options,
        })
        .catch(e => console.warn(e))

      if (res.canceled) {
        throw new Error('User cancel operation')
      }

      if (!res.filePath) {
        throw new Error('Failure to obtain the file path')
      }

      const destinationPath = res.filePath

      await fs.copy(filePath, destinationPath)
    },
  )

  // 复制文件到剪切板
  ipcMain.handle('copy-file-to-clipboard', async (_, filePath) => {
    try {
      if (!filePath) {
        throw new Error('File path is required')
      }

      const success = await copyFileToClipboard(filePath)

      return {
        success,
        message: success ? 'File copied to clipboard successfully' : 'Failed to copy file to clipboard',
      }
    }
    catch (error) {
      console.error('IPC copy-file-to-clipboard error:', error.message)
      return {
        success: false,
        message: error.message,
      }
    }
  })

  // 获取系统临时目录
  ipcMain.handle('get-temp-path', async () => {
    try {
      const tempDir = app.getPath('temp')
      // 创建应用专用临时目录
      const appTempDir = path.join(tempDir, 'escrcpy-preview')
      await fs.ensureDir(appTempDir)
      return appTempDir
    }
    catch (error) {
      console.error('IPC get-temp-path error:', error.message)
      throw error
    }
  })

  // 重命名临时文件
  ipcMain.handle('rename-temp-file', async (_, { oldPath, newPath }) => {
    try {
      if (!oldPath || !newPath) {
        throw new Error('Both oldPath and newPath are required')
      }

      // 确保文件在临时目录中（安全检查）
      const tempDir = app.getPath('temp')
      const appTempDir = path.join(tempDir, 'escrcpy-preview')

      if (!oldPath.startsWith(appTempDir) || !newPath.startsWith(appTempDir)) {
        throw new Error('File paths must be within the app temp directory')
      }

      // 检查源文件是否存在
      const exists = await fs.pathExists(oldPath)
      if (!exists) {
        throw new Error('Source file does not exist')
      }

      // 执行重命名
      await fs.rename(oldPath, newPath)

      return { success: true, newPath }
    }
    catch (error) {
      console.error('IPC rename-temp-file error:', error.message)
      throw error
    }
  })
}
