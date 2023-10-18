import fs from 'fs-extra'
import { dialog, ipcMain, shell } from 'electron'

export default () => {
  ipcMain.handle(
    'show-open-dialog',
    async (event, { preset = '', ...options } = {}) => {
      // console.log('options', options)
      try {
        const res = await dialog.showOpenDialog(options)
        // console.log('showOpenDialog.res', res)
        if (res.canceled) {
          return false
        }
        const filePaths = res.filePaths

        switch (preset) {
          case 'replaceFile':
            await fs.copy(filePaths[0], options.filePath, { overwrite: true })
            break
        }

        return filePaths
      }
      catch (error) {
        console.warn(error?.message || error)
        return false
      }
    },
  )

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

  ipcMain.handle(
    'show-save-dialog',
    async (event, { filePath = '', ...options } = {}) => {
      try {
        const result = await dialog.showSaveDialog({
          ...options,
        })
        if (!result || result.canceled || !result.filePath) {
          return false
        }

        const destinationPath = result.filePath

        await fs.copy(filePath, destinationPath)

        return true
      }
      catch (error) {
        console.error(error?.message || error)
        return false
      }
    },
  )
}
