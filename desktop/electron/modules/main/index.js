import { BrowserWindow, app as electronApp } from 'electron'
import remote from '@electron/remote/main'
import electronStore from '$electron/helpers/store/index.js'
import { Edger } from '$electron/helpers/edger/index.js'
import { createWindowManager } from '$electron/helpers/core/index.js'
import { globalEventEmitter } from '$electron/helpers/emitter/index.js'

export default {
  name: 'module:main',
  order: 0,
  apply(app) {
    if (!app?.has?.('remote:initialized')) {
      remote.initialize()
      app?.provide?.('remote:initialized', true)
    }

    const manager = createWindowManager('main', {
      app,
      singleton: true,
      windowOptions: {
        main: true,
        preloadDir: app.preloadDir,
        persistenceBounds: true,
      },
      hooks: {
        created(win) {
          app?.provide?.('window:main', win)
          app?.emit?.('window:main:ready', win)
        },
        ready(win) {
          win.show?.()
        },
      },
    })

    app?.provide?.('window:main:manager', manager)

    const openMainWindow = () => {
      const win = manager.open({ show: false })
      const mainWindow = win?.raw

      if (!mainWindow) {
        console.error('[module:main] Failed to create browser window')
        return null
      }

      try {
        remote.enable(mainWindow.webContents)
      }
      catch (error) {
        console.warn('[window] remote enable failed:', error?.message || error)
      }

      try {
        const executeArgsService = app?.inject?.('service:execute-arguments')
        if (executeArgsService) {
          const args = executeArgsService.getArguments?.()

          if (args) {
            mainWindow.webContents.send('execute-arguments-change', {
              deviceId: args['device-id'],
              appName: args['app-name'],
              packageName: args['package-name'],
            })
          }
        }
      }
      catch (error) {
        console.warn('[window] Failed to send execute arguments:', error?.message || error)
      }

      mainWindow.on('minimize', () => {
        globalEventEmitter.emit('tray:create')
      })

      if (electronStore.get('common.edgeHidden')) {
        try {
          new Edger(mainWindow)
        }
        catch (error) {
          console.warn('[window] Edger initialization failed:', error?.message || error)
        }
      }

      return mainWindow
    }

    app?.once?.('app:started', async () => {
      try {
        await electronApp.whenReady()
        openMainWindow()
      }
      catch (error) {
        console.error('[module:main] Error waiting for app ready:', error)
      }
    })

    electronApp.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        openMainWindow()
        return
      }

      const win = manager.get?.()
      const mainWindow = win?.raw

      mainWindow?.show?.()
      mainWindow?.focus?.()

      if (process.platform === 'darwin') {
        electronApp.dock.show()
      }

      globalEventEmitter.emit('tray:destroy')
    })

    electronApp.on('window-all-closed', () => {
      electronApp.isQuiting = true
      electronApp.quit()
    })
  },
}
