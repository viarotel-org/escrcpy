import { BrowserWindow, ipcMain, Menu } from 'electron'

export function install(controlWindow) {
  const onFocus = () => {
    controlWindow.webContents.send('window-focus', true)
  }

  const onBlur = () => {
    controlWindow.webContents.send('window-focus', false)
  }

  const onOpenSystemMenu = (event, args = {}) => {
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

  controlWindow.on('focus', onFocus)
  controlWindow.on('blur', onBlur)

  ipcMain.off('open-system-menu', onOpenSystemMenu)
  ipcMain.on('open-system-menu', onOpenSystemMenu)

  return () => {
    controlWindow.off('focus', onFocus)
    controlWindow.off('blur', onBlur)
    ipcMain.off('open-system-menu', onOpenSystemMenu)
  }
}

export default {
  install,
}
