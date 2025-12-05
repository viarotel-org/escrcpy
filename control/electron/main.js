import { BrowserWindow, ipcMain } from 'electron'
import { initControlWindow, openControlWindow } from './helpers/index.js'

import * as events from './events/index.js'

export default (mainWindow) => {
  let controlWindow

  ipcMain.handle('open-control-window', (event, data) => {
    controlWindow = BrowserWindow.getAllWindows().find(
      win => win.customId === 'control',
    )

    if (controlWindow) {
      openControlWindow(controlWindow, data)
      return false
    }

    controlWindow = initControlWindow(mainWindow)
    events.install(controlWindow)

    ipcMain.on('control-mounted', () => {
      openControlWindow(controlWindow, data)
    })
  })

  ipcMain.handle('hide-control-window', () => {
    controlWindow.hide()
  })

  ipcMain.handle('close-control-window', () => {
    controlWindow.close()
  })
}
