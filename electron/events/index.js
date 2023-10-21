import { app, ipcMain } from 'electron'

import updater from './updater/index.js'
import handles from './handles/index.js'
import tray from './tray/index.js'

export default (mainWindow) => {
  ipcMain.on('restart-app', () => {
    app.relaunch()
    app.quit()
  })
  handles(mainWindow)
  updater(mainWindow)
  tray(mainWindow)
}
