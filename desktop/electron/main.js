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
import { createElectronApp } from '@escrcpy/electron-modularity/main'

import {
  clipboardPlugin,
  sandboxPlugin,
  themePlugin,
  windowIPCPlugin,
} from '@escrcpy/electron-modularity/plugins'

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

const ctx = createElectronApp({
  preloadDir: __dirname,
  rendererDir: path.join(__dirname, '../dist'),
  devRendererDir: process.env.VITE_DEV_SERVER_URL,
  icon: getLogoPath(),
  width: browserWindowWidth,
  height: browserWindowHeight,
  backgroundColor: getAppBackgroundColor(),
})

app.whenReady().then(() => {
  ctx.use(sandboxPlugin)
  ctx.use(main)
  ctx.use(lifecycle)

  ctx.use(control)
  ctx.use(copilot)
  ctx.use(explorer)

  ctx.use(clipboardPlugin)
  ctx.use(themePlugin)
  ctx.use(windowIPCPlugin)

  ctx.use(edger)
  ctx.use(listeners)
  ctx.use(handles)
  ctx.use(tray)
  ctx.use(contextMenu)
  ctx.use(updater)
  ctx.use(launch)
  ctx.use(shortcuts)

  ctx.start()
})
