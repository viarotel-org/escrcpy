/**
 * Window Factory
 * Standardized window creation with integrated features
 */

import remote from '@electron/remote/main'
import electronStore from '$electron/helpers/store/index.js'
import { createBrowserWindow } from '$electron/helpers/window/index.js'
import { Edger } from '$electron/helpers/edger/index.js'
import { registerWindow } from './registry.js'

/**
 * Create main window with all integrated features
 * @param {Object} options - Window creation options
 * @param {string} options.name - Window name for registry (default: 'main')
 * @param {boolean} options.enableEdger - Enable edge snapping (default: from store)
 * @param {boolean} options.enableRemote - Enable @electron/remote (default: true)
 * @param {Object} options.windowOptions - Additional BrowserWindow options
 * @returns {Electron.BrowserWindow}
 */
export function createMainWindow(options = {}) {
  const {
    name = 'main',
    enableEdger = electronStore.get('common.edgeHidden'),
    enableRemote = true,
    preloadDir = '',
    windowOptions = {},
  } = options

  // Create window instance
  const mainWindow = createBrowserWindow({
    preloadDir,
    ...windowOptions,
  })

  // Load page
  mainWindow.loadPage()

  // Enable @electron/remote
  if (enableRemote) {
    remote.enable(mainWindow.webContents)
  }

  // Show window when ready
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Enable edge snapping if configured
  if (enableEdger) {
    new Edger(mainWindow)
  }

  // Register window in registry
  registerWindow(name, mainWindow)

  return mainWindow
}

/**
 * Create window factory for specific configurations
 * @param {Object} defaultOptions - Default options for all windows
 * @returns {Function} Factory function
 */
export function createWindowFactory(defaultOptions = {}) {
  return (options = {}) => {
    return createMainWindow({
      ...defaultOptions,
      ...options,
    })
  }
}
