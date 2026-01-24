/**
 * Escrcpy Application Entry Point
 * Minimal application bootstrap - all logic delegated to modules
 */

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

// Import application factory
import { createElectronApp } from './modules/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Create and start application
 */
const app = createElectronApp({
  window: {
    preloadDir: __dirname,
  },
})

app.start()
