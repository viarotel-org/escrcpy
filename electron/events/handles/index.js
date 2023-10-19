import fs from 'fs-extra'
import { dialog, ipcMain, shell } from 'electron'

export default () => {
  ipcMain.handle(
    'show-open-dialog',
    async (event, { preset = '', ...options } = {}) => {
      // console.log('options', options)
      const res = await dialog
        .showOpenDialog(options)
        .catch(e => console.warn(e))

      if (res.canceled) {
        throw new Error('用户取消操作')
      }

      if (!res.filePaths.length) {
        throw new Error('获取目录或文件路径失败')
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

  ipcMain.handle('open-path', async (event, pathValue) => {
    return shell.openPath(pathValue)
  })

  ipcMain.handle('show-item-in-folder', async (event, filePath) => {
    return shell.showItemInFolder(filePath)
  })

  ipcMain.handle(
    'show-save-dialog',
    async (event, { filePath = '', ...options } = {}) => {
      const res = await dialog
        .showSaveDialog({
          ...options,
        })
        .catch(e => console.warn(e))

      if (res.canceled) {
        throw new Error('用户取消操作')
      }

      if (!res.filePath) {
        throw new Error('获取文件路径失败')
      }

      const destinationPath = res.filePath

      await fs.copy(filePath, destinationPath)
    },
  )
}
