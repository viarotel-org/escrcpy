import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import minimist from 'minimist'

import remote from '@electron/remote/main'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, shell, ipcMain } from 'electron'
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

// Initialize logging with error handling
try {
  log.initialize({ preload: true })
} catch (error) {
  console.error(`Failed to initialize log: ${error.message || error}`)
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

function createWindow(callback) {
  const bounds = appStore.get('common.bounds') || {}

  const baseWidth = 800
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
    frame: false, // Set frameless window for custom titlebar
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
    backgroundColor: '#00000000',
    ...(process.platform === 'darwin' ? { vibrancy: 'under-window' } : {}),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: true,
      sandbox: false,
      spellcheck: false,
    },
  })

  mainWindow.customId = 'mainWindow'

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

  // Track window states for titlebar
  let isWindowFocused = true
  
  // Window event handlers
  mainWindow.on('focus', () => {
    isWindowFocused = true
    mainWindow.webContents.send('window:focus-change', true)
  })
  
  mainWindow.on('blur', () => {
    isWindowFocused = false
    mainWindow.webContents.send('window:focus-change', false)
  })
  
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window:maximize-change', true)
  })
  
  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window:maximize-change', false)
  })

  ;['resize', 'move'].forEach((eventName) => {
    mainWindow.on(eventName, () => {
      if(mainWindow.isMaximized()) {
        return false
      }
  
      const bounds = mainWindow.getBounds()

      if(bounds.x < 0) bounds.x = 0
      if(bounds.y < 0) bounds.y = 0

      try {
        appStore.set('common.bounds', {
          ...bounds
        })
      } catch (error) {
        console.error(`Failed to save window bounds: ${error.message || error}`)
      }
    })
  })

  try {
    loadPage(mainWindow)
    ipc(mainWindow)
    control(mainWindow)
  } catch (error) {
    console.error(`Failed to initialize window content: ${error.message || error}`)
  }

  callback?.(mainWindow)
}

function onWhenReady(callback) {
  app.whenReady().then(() => {
    try {
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
    } catch (error) {
      console.error(`Error during app initialization: ${error.message || error}`)
    }
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

  try {
    Object.entries(executeArgs).forEach(([key, value]) => {
      process.env[`EXECUTE_ARG_${toUpper(snakeCase(key))}`] = value
    })

    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('execute-arguments-change', {
        deviceId: executeArgs['device-id'],
        appName: executeArgs['app-name'],
        packageName: executeArgs['package-name'],
      })
    }
  } catch (error) {
    console.error(`Error processing execute arguments: ${error.message || error}`)
  }

  return executeArgs
}

// Handle app exit and cleanup
app.on('window-all-closed', () => {
  try {
    // Clean up log streams before exiting
    if (log && typeof log.cleanup === 'function') {
      log.cleanup()
    }
    
    app.isQuiting = true
    app.quit()
    mainWindow = null
  } catch (error) {
    console.error(`Error during app cleanup: ${error.message || error}`)
    // Force quit the app even if cleanup failed
    process.exit(1)
  }
})

// Additional cleanup on app before-quit event
app.on('before-quit', () => {
  try {
    // Perform log cleanup as early as possible
    if (log && typeof log.cleanup === 'function') {
      log.cleanup()
    }
  } catch (error) {
    console.error(`Error during before-quit cleanup: ${error.message || error}`)
  }
})