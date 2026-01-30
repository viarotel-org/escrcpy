import { app, dialog, Menu, Tray } from 'electron'
import { trayPath } from '$electron/configs/index.js'
import { executeI18n } from '$electron/helpers/index.js'
import electronStore from '$electron/helpers/store/index.js'
import { globalEventEmitter } from '$electron/helpers/emitter/index.js'
import { sleep } from '$/utils'
import { resolveMainWindow } from '@escrcpy/electron-modularity/main'

export default {
  name: 'service:tray',
  async apply(ctx) {
    const mainWindow = await resolveMainWindow(ctx)

    if (!mainWindow) {
      console.warn('[tray] main window not available')
      return
    }

    const t = value => executeI18n(mainWindow, value)

    let tray = null

    globalEventEmitter.on('tray:destroy', () => {
      tray?.destroy?.()
    })

    globalEventEmitter.on('tray:create', () => {
      createTray()
    })

    mainWindow.on('close', async (event) => {
      if (app.isQuiting) {
        return true
      }

      event.preventDefault()

      let appCloseCode = electronStore.get('common.appCloseCode')

      if (![0, 1].includes(appCloseCode)) {
        const { response } = await dialog.showMessageBox({
          type: 'question',
          cancelId: 2,
          buttons: [
            await t('appClose.quit'),
            await t('appClose.minimize'),
            await t('appClose.quit.cancel'),
          ],
          title: await t('common.tips'),
          message: await t('appClose.message'),
        })

        appCloseCode = response
      }

      closeApp(appCloseCode)
    })

    function showApp() {
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

    function hideApp() {
      if (process.platform === 'darwin') {
        app.dock.hide()
      }

      mainWindow.hide()

      return true
    }

    async function quitApp() {
      app.isQuiting = true

      mainWindow.webContents.send('quit-before')

      await sleep(1 * 1000)

      app.quit()

      return true
    }

    function closeApp(response) {
      if (response === 0) {
        quitApp()
        return true
      }
      else if (response === 1) {
        createTray()
        return true
      }

      return false
    }

    async function createTray() {
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
          label: await t('appClose.quit'),
          click: () => {
            quitApp()
          },
        },
      ])

      tray.setContextMenu(contextMenu)
    }
  },
}
