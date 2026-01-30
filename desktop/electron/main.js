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

const app = createElectronApp({
  preloadDir: __dirname,
  rendererDir: path.join(__dirname, '../dist'),
  devRendererDir: process.env.VITE_DEV_SERVER_URL,
  icon: getLogoPath(),
  width: browserWindowWidth,
  height: browserWindowHeight,
  backgroundColor: getAppBackgroundColor(),
})

app.use(sandboxPlugin)
app.use(main)
app.use(lifecycle)

app.use(control)
app.use(copilot)
app.use(explorer)

app.use(clipboardPlugin)
app.use(themePlugin)
app.use(windowIPCPlugin)

app.use(edger)
app.use(listeners)
app.use(handles)
app.use(tray)
app.use(contextMenu)
app.use(updater)
app.use(launch)
app.use(shortcuts)

app.start()
