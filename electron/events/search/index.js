import { globalShortcut, ipcMain } from 'electron'
import { FindInPageManager } from './helper.js'

export default (mainWindow) => {
  mainWindow.on('focus', () => {
    globalShortcut.register('CommandOrControl+F', (event) => {
      mainWindow.webContents.send('focus-on-search')
    })
  })

  mainWindow.on('blur', () => {
    globalShortcut.unregister('CommandOrControl+F')
  })

  const findInPageManager = new FindInPageManager(mainWindow.webContents)

  ipcMain.handle('findInPageStart', async (event, args = {}) => {
    return findInPageManager.start(args)
  })
  ipcMain.handle('findInPageNext', async (event, args = {}) => {
    return findInPageManager.next(args)
  })
  ipcMain.handle('findInPagePrev', async (event, args = {}) => {
    return findInPageManager.prev(args)
  })
  ipcMain.handle('findInPageStop', async (event, args = {}) => {
    return findInPageManager.stop(args)
  })
}
