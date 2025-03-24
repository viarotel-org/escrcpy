import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import minimist from 'minimist'

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

import { Edger } from './helpers/edger/index.js'

import { ensureSingleInstance } from './helpers/single.js'
import { eventEmitter } from './helpers/emitter.js'
import { snakeCase, toUpper } from 'lodash-es'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

log.initialize({ preload: true })


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

function createWindow(callback) {
  const bounds = appStore.get('common.bounds') || {}

  const baseWidth = 768
  const baseHeight = Number((baseWidth / 1.57).toFixed())

  mainWindow = new BrowserWindow({
    width: baseWidth,
    minWidth: baseWidth,
    height: baseHeight,
    minHeight: baseHeight,
    ...bounds,
    show: false,
    icon: getLogoPath(),
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

  const edgeHidden = appStore.get('common.edgeHidden')
  if(edgeHidden) {
    new Edger(mainWindow)
  }

  ;['resize', 'move'].forEach((eventName) => {
    mainWindow.on(eventName, () => {
      if(mainWindow.isMaximized()) {
        return false
      }
  
      const bounds = mainWindow.getBounds()

      if(bounds.x < 0) bounds.x = 0
      if(bounds.y < 0) bounds.y = 0

      appStore.set('common.bounds', {
        ...bounds
      })
    })
  })

  loadPage(mainWindow)

  ipc(mainWindow)

  control(mainWindow)

  callback?.(mainWindow)
}

function onWhenReady(callback) {
  app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.viarotel.escrcpy')
  
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })
  
    createWindow(callback)
  
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
}

ensureSingleInstance({
  onSuccess() {
    onWhenReady((mainWindow)=> {
      runExecuteArguments(mainWindow, process.argv)
    })
  },
  onShowWindow(mainWindow, commandLine, next) {
    const executeArgs = runExecuteArguments(mainWindow, commandLine)
    
    if(!executeArgs['device-id']) {
      next()
      eventEmitter.emit('tray:destroy')
    }
  }
})

function runExecuteArguments(mainWindow, commandLine) {
  // TEST
  // commandLine = [
  //   '--device-id=192.168.0.88:5555',
  //   '--package-name=com.android.mms',
  //   '--app-name=消息',
  // ]

  const executeArgs = minimist(commandLine)

  Object.entries(executeArgs).forEach(([key, value]) => {
    process.env[`EXECUTE_ARG_${toUpper(snakeCase(key))}`] = value
  })

  mainWindow.webContents.send('execute-arguments-change', {
    deviceId: executeArgs['device-id'],
    appName: executeArgs['app-name'],
    packageName: executeArgs['package-name'],
  })

  return executeArgs
}

app.on('window-all-closed', () => {
  app.isQuiting = true
  app.quit()
  mainWindow = null
})