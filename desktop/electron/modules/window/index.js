import { BrowserWindow, app as electronApp } from 'electron'
import remote from '@electron/remote/main'

import electronStore from '$electron/helpers/store/index.js'
import { Edger } from '$electron/helpers/edger/index.js'
import { createWindowManager } from '$electron/helpers/core/index.js'
import { globalEventEmitter } from '$electron/helpers/emitter/index.js'

let mainWindow

export function getMainWindow() {
  return mainWindow
}

export function setMainWindow(win) {
  mainWindow = win
  return mainWindow
}

export default {
  name: 'module:window',
  order: 0,
  apply(app) {
    if (!app?.has?.('remote:initialized')) {
      remote.initialize()
      app?.provide?.('remote:initialized', true)
    }

    const manager = createWindowManager('main', {
      app,
      singleton: true,
      hooks: {
        created(win) {
          setMainWindow(win)
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
      if (mainWindow && !mainWindow.isDestroyed?.()) {
        return mainWindow
      }

      const win = manager.open({ page: 'main', show: false })

      if (win?.webContents) {
        try {
          remote.enable(win.webContents)
        }
        catch (error) {
          console.warn('[window] remote enable failed:', error?.message || error)
        }
      }

      if (electronStore.get('common.edgeHidden')) {
        new Edger(win)
      }

      return win
    }

    electronApp.whenReady().then(openMainWindow)

    electronApp.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        openMainWindow()
        return
      }

      if (process.platform === 'darwin') {
        electronApp.dock.show()
      }

      mainWindow?.show?.()
      mainWindow?.focus?.()
      globalEventEmitter.emit('tray:destroy')
    })

    electronApp.on('window-all-closed', () => {
      electronApp.isQuiting = true
      electronApp.quit()
    })
  },
}
