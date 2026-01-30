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

import { browserWindowHeight, browserWindowWidth, getLogoPath } from './configs/index.js'
import { getAppBackgroundColor } from './helpers/index.js'
import services from './services/index.js'
import modules from './modules/index.js'

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

app.use(services)
app.use(modules)

app.start()
