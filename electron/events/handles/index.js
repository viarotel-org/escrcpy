import fs from 'fs-extra'
import { dialog, ipcMain, shell } from 'electron'

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
}
