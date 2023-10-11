import { app, ipcMain } from 'electron'
import updaterEvents from './updater/index.js'

export default (mainWindow) => {
  ipcMain.on('restart-app', () => {
    app.relaunch()
    app.quit()
  })
  updaterEvents(mainWindow)
}
