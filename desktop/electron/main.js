// Process configuration must be imported first
import './helpers/process/index.js'

//  Node.js path utilities
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Initialize electron-store
import './helpers/store/index.js'

// Initialize debugger
import './helpers/debugger/index.js'
import './helpers/debugger/main.js'

import { app } from 'electron'
import { createElectronApp } from '@escrcpy/electron-setup/main'

import {
  clipboardPlugin,
  sandboxPlugin,
  themePlugin,
  windowIPCPlugin,
} from '@escrcpy/electron-setup/plugins'

import { browserWindowHeight, browserWindowWidth, getLogoPath } from './configs/index.js'
import { getAppBackgroundColor } from './helpers/index.js'

import {
  contextMenu,
  edger,
  handles,
  launch,
  lifecycle,
  listeners,
  shortcuts,
  tray,
  updater,
} from './services/index.js'

import {
  control,
  copilot,
  explorer,
  main,
} from './modules/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const mainApp = createElectronApp({
  preloadDir: __dirname,
  rendererDir: path.join(__dirname, '../dist'),
  devRendererDir: process.env.VITE_DEV_SERVER_URL,
  icon: getLogoPath(),
  width: browserWindowWidth,
  height: browserWindowHeight,
  backgroundColor: getAppBackgroundColor(),
})

mainApp.use(sandboxPlugin)
mainApp.use(main)
mainApp.use(lifecycle)

mainApp.use(themePlugin)
mainApp.use(windowIPCPlugin)
mainApp.use(clipboardPlugin)

mainApp.use(edger)
mainApp.use(listeners)
mainApp.use(handles)
mainApp.use(tray)
mainApp.use(contextMenu)
mainApp.use(updater)
mainApp.use(launch)
mainApp.use(shortcuts)

mainApp.use(control)
mainApp.use(copilot)
mainApp.use(explorer)

app.whenReady().then(() => {
  mainApp.start()
})
