import { app, BrowserWindow, dialog, ipcMain, screen, shell } from 'electron'
import fs from 'fs-extra'
import path from 'node:path'
import { openLogPath } from '$root/electron/helpers/debugger/index.js'

export default () => {
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

      return true
    },
  )

  // Get system temporary directory
  ipcMain.handle('get-temp-path', async () => {
    try {
      const tempDir = app.getPath('temp')
      // Create app-specific temp directory
      const appTempDir = path.join(tempDir, 'escrcpy-preview')
      await fs.ensureDir(appTempDir)
      return appTempDir
    }
    catch (error) {
      console.error('IPC get-temp-path error:', error.message)
      throw error
    }
  })

  // Rename temporary file
  ipcMain.handle('rename-temp-file', async (_, { oldPath, newPath }) => {
    try {
      if (!oldPath || !newPath) {
        throw new Error('Both oldPath and newPath are required')
      }

      // Ensure files are within temp directory (safety check)
      const tempDir = app.getPath('temp')
      const appTempDir = path.join(tempDir, 'escrcpy-preview')

      if (!oldPath.startsWith(appTempDir) || !newPath.startsWith(appTempDir)) {
        throw new Error('File paths must be within the app temp directory')
      }

      // Check source file exists
      const exists = await fs.pathExists(oldPath)
      if (!exists) {
        throw new Error('Source file does not exist')
      }

      // Perform rename
      await fs.rename(oldPath, newPath)

      return { success: true, newPath }
    }
    catch (error) {
      console.error('IPC rename-temp-file error:', error.message)
      throw error
    }
  })

  // Navigate to route
  ipcMain.handle('navigate-to-route', async (event, route) => {
    const win = BrowserWindow.fromWebContents(event.sender)

    try {
      if (win && !win.isDestroyed()) {
        win.show()
        win.webContents.send('navigate-to-route', route)
      }
      return true
    }
    catch (error) {
      console.error('IPC navigate-to-route error:', error.message)
      return false
    }
  })

  ipcMain.handle('open-log-path', async (event) => {
    try {
      await openLogPath()
      return true
    }
    catch (error) {
      console.error('IPC open-log-path error:', error.message)
      return false
    }
  })

  /**
   * Retrieve a temporary Gitee access token
   */
  ipcMain.handle('get-gitee-temporary-token', async (_, params) => {
    const response = await fetch(`${import.meta.env.VITE_GITEE_BASE_API}/tokens/temporary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_GITEE_APP_TOKEN}`,
      },
      body: JSON.stringify({
        seconds: params?.seconds ?? 7,
      }),
    })

    const data = await response.json()

    return data.token
  })
}
