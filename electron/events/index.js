import { app, ipcMain } from 'electron'

import handles from './handles/index.js'
import shortcuts from './shortcuts/index.js'
import theme from './theme/index.js'
import tray from './tray/index.js'
import updater from './updater/index.js'

export default (mainWindow) => {
  ipcMain.on('restart-app', () => {
    app.isQuiting = true
    app.relaunch()
    app.quit()
  })

  handles(mainWindow)
  updater(mainWindow)
  tray(mainWindow)
  theme(mainWindow)
  shortcuts(mainWindow)
}
