import { dialog, ipcMain, shell } from 'electron'

export default () => {
  ipcMain.handle('show-open-dialog', async (event, params) => {
    // console.log('params', params)
    try {
      const res = await dialog.showOpenDialog(params)
      // console.log('showOpenDialog.res', res)
      if (res.canceled) {
        return false
      }
      return res.filePaths
    }
    catch (error) {
      console.warn(error?.message || error)
      return false
    }
  })

  ipcMain.handle('open-path', async (event, pathValue) => {
    try {
      await shell.openPath(pathValue)
      return true
    }
    catch (error) {
      console.warn(error?.message || error)
      return false
    }
  })

  ipcMain.handle('show-item-in-folder', async (event, filePath) => {
    try {
      await shell.showItemInFolder(filePath)
      return true
    }
    catch (error) {
      console.warn(error?.message || error)
      return false
    }
  })
}
