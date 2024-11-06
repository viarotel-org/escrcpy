import { BrowserWindow, ipcMain, Menu } from 'electron'

export default function (controlWindow) {
  ipcMain.on('open-system-menu', openSystemMenu)

  function openSystemMenu(event, args = {}) {
    const { options = [], channel = 'system-menu-click' } = args

    const template = options.map((item) => {
      return {
        label: item.label,
        click() {
          controlWindow.webContents.send(channel, item.value, item)
        },
      }
    })

    const menu = Menu.buildFromTemplate(template)
    menu.popup(BrowserWindow.fromWebContents(event.sender))
  }
}
