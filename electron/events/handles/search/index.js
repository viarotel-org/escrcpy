import { ipcMain } from 'electron'

export default (mainWindow) => {
  ipcMain.handle('find-in-page', async (_, { text, ...args } = {}) => {
    return mainWindow.webContents.findInPage(text, {
      ...args,
    })
  })
  ipcMain.handle('stop-find-in-page', async (_, action = 'clearSelection') => {
    return mainWindow.webContents.stopFindInPage(action)
  })
}
