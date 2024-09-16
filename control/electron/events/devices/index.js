import { BrowserWindow, ipcMain, Menu } from 'electron'
import { openControlWindow } from '$control/electron/helpers/index.js'

export default function (controlWindow) {
  ipcMain.on('open-control-device-menu', (event, deviceList) => {
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
