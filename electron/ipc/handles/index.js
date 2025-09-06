import { dialog, ipcMain, screen, shell } from 'electron'
import fs from 'fs-extra'
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
}
