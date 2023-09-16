import { app, ipcMain } from 'electron'

ipcMain.on('restart-app', () => {
  app.relaunch()
  app.quit()
})
