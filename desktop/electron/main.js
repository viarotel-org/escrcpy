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

import { createElectronApp } from './helpers/core/index.js'

import services from './services/index.js'
import modules from './modules/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = createElectronApp({
  preloadDir: __dirname,
})

app.use(services)
app.use(modules)

app.start()
