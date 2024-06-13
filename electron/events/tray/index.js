import { Menu, Tray, app, dialog } from 'electron'
import { trayPath } from '$electron/configs/index.js'
import appStore from '$electron/helpers/store.js'
import { executeI18n } from '$electron/helpers/index.js'

export default (mainWindow) => {
  const t = value => executeI18n(mainWindow, value)

  let tray = null

  const showApp = () => {
    if (process.platform === 'darwin') {
      app.dock.show()
    }

    mainWindow.show()

    if (tray) {
      tray.destroy()
      tray = null
    }

    return true
  }

  const hideApp = () => {
    if (process.platform === 'darwin') {
      app.dock.hide()
    }

    mainWindow.hide()

    return true
  }

  const quitApp = () => {
    app.isQuiting = true

    app.quit()

    return true
  }

  const closeApp = async (response) => {
    if (response === 0) {
      quitApp()
      return true
    }
    else if (response === 1) {
      hideApp()

      tray = new Tray(trayPath)

      tray.setToolTip('escrcpy')

      tray.on('click', () => {
        showApp()
      })

      const contextMenu = Menu.buildFromTemplate([
        {
          label: await t('common.open'),
          click: () => {
            showApp()
          },
        },
        {
          label: await t('common.restart'),
          click: () => {
            app.relaunch()
            quitApp()
          },
        },
        {
          label: await t('close.quit'),
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
      buttons: [
        await t('close.quit'),
        await t('close.minimize'),
        await t('close.quit.cancel'),
      ],
      title: await t('common.tips'),
      message: await t('close.message'),
      checkboxChecked: false,
      checkboxLabel: await t('close.remember'),
    })

    if (checkboxChecked && [0, 1].includes(response)) {
      appStore.set('appCloseCode', response)
    }

    closeApp(response)
  })
}
