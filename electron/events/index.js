import { app, ipcMain } from 'electron'

import updater from './updater/index.js'
import handles from './handles/index.js'

export default (mainWindow) => {
  handles(mainWindow)
  updater(mainWindow)

  ipcMain.on('restart-app', () => {
    app.relaunch()
    app.quit()
  })
}
