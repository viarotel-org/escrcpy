import { BrowserWindow, ipcMain, Menu } from 'electron'

export default function (controlWindow) {
  ipcMain.on('open-device-volume-menu', openDeviceVolumeMenu)

  function openDeviceVolumeMenu(event, args = {}) {
    const { options = [] } = args

    const template = options.map((item) => {
      return {
        label: item.label,
        click() {
          controlWindow.webContents.send('execute-device-volume-shell', item.value)
        },
      }
    })

    const menu = Menu.buildFromTemplate(template)
    menu.popup(BrowserWindow.fromWebContents(event.sender))
  }
}
