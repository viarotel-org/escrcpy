import { BrowserWindow, ipcMain } from 'electron'
import { initControlWindow, openControlWindow } from './helpers/index.js'

import { devices, gnirehtet, rotation, volume } from './events/index.js'

function onControlMounted(controlWindow) {
  ipcMain.on('language-change', (event, data) => {
    controlWindow.webContents.send('language-change', data)
  })

  ipcMain.on('theme-change', (event, data) => {
    controlWindow.webContents.send('theme-change', data)
  })

  rotation(controlWindow)
  devices(controlWindow)
  volume(controlWindow)
  gnirehtet(controlWindow)
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
}
