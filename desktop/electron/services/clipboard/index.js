import { clipboard, ipcMain } from 'electron'
import { copyFileToClipboard } from '$electron/helpers/clipboard.js'

export default () => {
  // Copy file to clipboard
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

  // Copy text to clipboard
  ipcMain.handle('copy-text-to-clipboard', async (_, text) => {
    try {
      if (!text) {
        throw new Error('Text is required')
      }

      const success = await clipboard.writeText(text)

      return {
        success,
        message: success ? 'Text copied to clipboard successfully' : 'Failed to copy text to clipboard',
      }
    }
    catch (error) {
      console.error('IPC copy-text-to-clipboard error:', error.message)
      return {
        success: false,
        message: error.message,
      }
    }
  })
}
