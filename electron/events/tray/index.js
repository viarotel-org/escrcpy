import { Menu, Tray, app, dialog } from 'electron'
import { macTrayPath, trayPath } from '@electron/configs/index'
import appStore from '@electron/helpers/store.js'

export default (mainWindow) => {
  let tray = null

  const showApp = () => {
    if (tray) {
      tray.destroy()
      tray = null
    }
    mainWindow.show()

    return true
  }

  const quitApp = () => {
    app.isQuiting = true
    app.quit()
    return true
  }

  const closeApp = (response) => {
    if (response === 0) {
      quitApp()
      return true
    }
    else if (response === 1) {
      mainWindow.hide()

      const trayIcon = process.platform === 'darwin' ? macTrayPath : trayPath

      tray = new Tray(trayIcon)

      tray.setToolTip('escrcpy')

      tray.on('click', () => {
        showApp()
      })

      const contextMenu = Menu.buildFromTemplate([
        {
          label: '打开',
          click: () => {
            showApp()
          },
        },
        {
          label: '重启服务',
          click: () => {
            app.relaunch()
            quitApp()
          },
        },
        {
          label: '退出',
          click: () => {
            quitApp()
          },
        },
      ])

      tray.setContextMenu(contextMenu)

      return true
    }

    return false
  }

  mainWindow.on('close', async (event) => {
    if (app.isQuiting) {
      mainWindow = null
      return true
    }

    event.preventDefault()

    const appCloseCode = appStore.get('appCloseCode')

    if (typeof appCloseCode === 'number') {
      closeApp(appCloseCode)
      return true
    }

    const { response, checkboxChecked } = await dialog.showMessageBox({
      type: 'question',
      buttons: ['退出', '最小化到托盘', '取消退出'],
      title: '提示',
      message: '确定要退出吗？',
      checkboxChecked: false,
      checkboxLabel: '是否记住选择？',
    })

    // console.log('response', response)
    // console.log('checkboxChecked', checkboxChecked)

    if (checkboxChecked) {
      appStore.set('appCloseCode', response)
    }

    closeApp(response)
  })
}
