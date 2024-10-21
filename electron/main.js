import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import remote from '@electron/remote/main'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, shell } from 'electron'
import contextMenu from 'electron-context-menu'
/** process.js 必须位于非依赖项的顶部 */
import { isPackaged } from './helpers/process.js'
import log from './helpers/log.js'
import './helpers/console.js'
import appStore from './helpers/store.js'

import { getLogoPath } from './configs/index.js'

import ipc from './ipc/index.js'

import control from '$control/electron/main.js'

import { loadPage } from './helpers/index.js'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

log.initialize({ preload: true })

const debug = !!appStore.get('common.debug')

if (!debug) {
  log.warn(
    'Debug Tips:',
    'If you need to generate and view the running log, please start the debugging function on the preference setting page'
  )
}

contextMenu({
  showCopyImage: false,
  showSelectAll: false,
  showSearchWithGoogle: false,
  showSaveImageAs: true,
  showInspectElement: !isPackaged,
})

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │

process.env.DIST = path.join(__dirname, '../dist')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    icon: getLogoPath(),
    show: false,
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: true,
      sandbox: false,
      spellcheck: false,
    },
  })

  remote.enable(mainWindow.webContents)
  remote.initialize()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  loadPage(mainWindow)

  ipc(mainWindow)

  control(mainWindow)
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.viarotel.escrcpy')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  // macOS 中应用被激活
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
      return
    }

    app.dock.show()
    mainWindow.show()
  })
})

app.on('window-all-closed', () => {
  app.isQuiting = true
  app.quit()
  mainWindow = null
})
