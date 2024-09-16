import { BrowserWindow, ipcMain, Menu } from 'electron'

export default function (controlWindow) {
  ipcMain.on('open-device-gnirehtet-menu', openDeviceGnirehtetMenu)

  function openDeviceGnirehtetMenu(event, args = {}) {
    const { options = [] } = args

    const template = options.map((item) => {
      return {
        label: item.label,
        click() {
          controlWindow.webContents.send(item.value)
        },
      }
    })

    const menu = Menu.buildFromTemplate(template)
    menu.popup(BrowserWindow.fromWebContents(event.sender))
  }
}
