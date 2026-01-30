import { BrowserWindow, app as electronApp, ipcMain } from 'electron'

export default {
  name: 'service:listeners',
  apply() {
    ipcMain.on('restart-app', () => {
      electronApp.isQuiting = true
      electronApp.relaunch()
      electronApp.quit()
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
  },
}
