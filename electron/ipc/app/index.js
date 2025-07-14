import { app, BrowserWindow, ipcMain } from 'electron'

export default () => {
  ipcMain.on('restart-app', () => {
    app.isQuiting = true
    app.relaunch()
    app.quit()
  })

  ipcMain.on('close-active-window', (event) => {
    const win = BrowserWindow.getFocusedWindow()

    if (win) {
      win.close()
    }
  })

  ipcMain.on('hide-active-window', (event) => {
    const win = BrowserWindow.getFocusedWindow()

    if (win) {
      win.hide()
    }
  })
}
