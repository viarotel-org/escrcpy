/** process.js must be required at the top */
import { isPackaged } from './helpers/process/index.js'
import appStore from './helpers/store.js'
import './helpers/debugger/index.js'
import './helpers/debugger/main.js'

import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import minimist from 'minimist'

import remote from '@electron/remote/main'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, shell } from 'electron'
import contextMenu from 'electron-context-menu'

import sandboxManager from './helpers/sandbox.js'

import { getLogoPath } from './configs/logo/index.js'
import { browserWindowWidth, browserWindowHeight } from './configs/index.js'

import ipc from './ipc/index.js'

import control from '$control/electron/main.js'
import explorer from '$explorer/electron/main.js'
import copilot from '$copilot/electron/main.js'

import { loadPage } from './helpers/index.js'

import { Edger } from './helpers/edger/index.js'

import { ensureSingleInstance } from './helpers/single.js'
import { eventEmitter } from './helpers/emitter.js'
import { snakeCase, toUpper } from 'lodash-es'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

contextMenu({
  showCopyImage: false,
  showSelectAll: false,
  showSearchWithGoogle: false,
  showSaveImageAs: true,
  showInspectElement: !isPackaged,
})


process.env.DIST = path.join(__dirname, '../dist')

let mainWindow

function createWindow(callback) {
  mainWindow = new BrowserWindow({
    width: browserWindowWidth,
    minWidth: browserWindowWidth,
    height: browserWindowHeight,
    minHeight: browserWindowHeight,
    show: false,
    icon: getLogoPath(),
    titleBarStyle: 'hidden', 
    ...(['win32'].includes(process.platform) ? { titleBarOverlay: true, } : {}),
    autoHideMenuBar: true,
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

  loadPage(mainWindow)

  ipc(mainWindow)

  control(mainWindow)

  explorer(mainWindow)

  copilot(mainWindow)

  callback?.(mainWindow)
}

async function onWhenReady(callback) {
  // Configure sandbox settings - must be called before app.whenReady()
  try {
    const sandboxResult = await sandboxManager.configureSandbox()
    console.info('Sandbox configuration completed:', {
      disabled: sandboxResult.disabled,
      reason: sandboxResult.reason,
      duration: sandboxResult.duration
    })
  } catch (error) {
    console.error('Sandbox configuration failed:', error.message)
  }
  
  await app.whenReady()

  electronApp.setAppUserModelId('com.viarotel.escrcpy')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow(callback)

  // Application activated on macOS
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
      return
    }

    app.dock.show()
    mainWindow.show()
    eventEmitter.emit('tray:destroy')
  })
}

ensureSingleInstance({
  onSuccess() {
    onWhenReady((mainWindow)=> {
      runExecuteArguments(mainWindow, process.argv)
    }).catch((error) => {
      console.error('Failed to initialize application:', error.message)
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