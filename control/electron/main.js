import { BrowserWindow, ipcMain, Menu } from 'electron'
import { initControlWindow, openControlWindow } from './helpers/index.js'

export default (mainWindow) => {
  let controlWindow

  ipcMain.on('open-control-window', (event, data) => {
    controlWindow = BrowserWindow.getAllWindows().find(
      win => win.customId === 'control',
    )

    if (!controlWindow) {
      controlWindow = initControlWindow(mainWindow)

      ipcMain.on('control-mounted', () => {
        openControlWindow(controlWindow, data)
      })

      return false
    }

    openControlWindow(controlWindow, data)
  })

  ipcMain.on('language-change', (event, data) => {
    if (controlWindow) {
      controlWindow.webContents.send('language-change', data)
    }
  })

  ipcMain.on('theme-change', (event, data) => {
    if (controlWindow) {
      controlWindow.webContents.send('theme-change', data)
    }
  })

  ipcMain.on('show-device-list', (event, deviceList) => {
    const template = deviceList.map((item) => {
      let label = item.$remark || item.$name

      if (item.$wifi) {
        label += ` (WIFI)`
      }

      return {
        label,
        click: () => {
          openControlWindow(controlWindow, item)
        },
      }
    })

    const menu = Menu.buildFromTemplate(template)
    menu.popup(BrowserWindow.fromWebContents(event.sender))
  })
}
