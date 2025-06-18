import { BrowserWindow, ipcMain } from 'electron'

/**
 * Sets up IPC handlers for window operations
 * @param {BrowserWindow} mainWindow - The main application window
 */
export default (mainWindow) => {
  // Window control handlers
  ipcMain.handle('window:minimize', () => {
    mainWindow.minimize()
    return true
  })

  ipcMain.handle('window:maximize', () => {
    mainWindow.maximize()
    return true
  })

  ipcMain.handle('window:unmaximize', () => {
    mainWindow.unmaximize()
    return true
  })

  ipcMain.handle('window:toggle-maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
      return false
    } else {
      mainWindow.maximize()
      return true
    }
  })

  ipcMain.handle('window:close', () => {
    mainWindow.close()
    return true
  })

  // Window state queries
  ipcMain.handle('window:is-maximized', () => {
    return mainWindow.isMaximized()
  })

  ipcMain.handle('window:is-minimized', () => {
    return mainWindow.isMinimized()
  })

  ipcMain.handle('window:is-focused', () => {
    return mainWindow.isFocused()
  })

  // Platform-specific behavior
  ipcMain.handle('window:get-platform', () => {
    return process.platform
  })

  // Setup window state change events
  mainWindow.on('focus', () => {
    mainWindow.webContents.send('window:focus-change', true)
  })

  mainWindow.on('blur', () => {
    mainWindow.webContents.send('window:focus-change', false)
  })

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window:maximize-change', true)
  })

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window:maximize-change', false)
  })

  mainWindow.on('minimize', () => {
    mainWindow.webContents.send('window:minimize-change', true)
  })

  mainWindow.on('restore', () => {
    mainWindow.webContents.send('window:minimize-change', false)
  })

  // Helper to get any window by ID
  ipcMain.handle('window:focus-by-id', (_, id) => {
    const windows = BrowserWindow.getAllWindows()
    const window = windows.find(w => w.id === id)
    if (window) {
      if (window.isMinimized()) {
        window.restore()
      }
      window.focus()
      return true
    }
    return false
  })
}
