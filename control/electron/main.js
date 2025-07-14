import { BrowserWindow, ipcMain } from 'electron'
import { initControlWindow, openControlWindow } from './helpers/index.js'

import { focus, menu } from './events/index.js'

function onControlMounted(controlWindow) {
  menu(controlWindow)

  focus(controlWindow)
}

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

    ipcMain.on('control-mounted', () => {
      openControlWindow(controlWindow, data)
      onControlMounted(controlWindow)
    })
  })

  ipcMain.handle('hide-control-window', () => {
    controlWindow.hide()
  })
}
