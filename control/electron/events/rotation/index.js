import { BrowserWindow, ipcMain, Menu } from 'electron'

export default function (controlWindow) {
  ipcMain.handle('open-device-rotation-menu', openDeviceRotationMenu)

  function openDeviceRotationMenu(event, args = {}) {
    const { options = [] } = args

    const template = options.map((item) => {
      return {
        label: item.label,
        click: () => {
          controlWindow.webContents.send(
            'execute-device-rotation-shell',
            item.value,
          )
        },
      }
    })

    const menu = Menu.buildFromTemplate(template)
    menu.popup(BrowserWindow.fromWebContents(event.sender))
  }
}
