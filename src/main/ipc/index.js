import { app, ipcMain } from 'electron'
import './updater/index.js'

ipcMain.on('restart-app', () => {
  app.relaunch()
  app.quit()
})
