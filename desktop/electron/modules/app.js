/**
 * Electron Application Factory
 * Unified application bootstrapping and lifecycle management
 */

import { electronApp } from '@electron-toolkit/utils'
import { app } from 'electron'
import remote from '@electron/remote/main'
import contextMenu from 'electron-context-menu'

import { isPackaged } from '$electron/helpers/index.js'

import { setupSingleInstance } from './lifecycle/single.js'
import { handleAppReady } from './lifecycle/ready.js'
import { windowManager } from './window/manager.js'
import { createSecondInstanceHandler, handleExecuteArguments } from './arguments/handler.js'
import { loadServices, registerBuiltInServices } from './services/index.js'
import { loadSubApps, registerBuiltInSubApps } from './subapps/index.js'

/**
 * Application configuration
 * @typedef {Object} AppConfig
 * @property {Object} [window] - Window configuration
 * @property {boolean} [skipSingleInstance] - Skip single instance check
 */

/**
 * Create and configure Electron application
 * @param {AppConfig} config - Application configuration
 * @returns {Object} Application instance
 */
export function createElectronApp(config = {}) {
  const { window: windowConfig = {}, skipSingleInstance = false } = config

  // Configure Electron app
  electronApp.setAppUserModelId('com.viarotel.escrcpy')
  remote.initialize()

  // Setup context menu
  contextMenu({
    showCopyImage: false,
    showSelectAll: false,
    showSearchWithGoogle: false,
    showSaveImageAs: true,
    showInspectElement: !isPackaged(),
  })

  // Register built-in services and subapps
  registerBuiltInServices()
  registerBuiltInSubApps()

  /**
   * Start application
   */
  const start = async () => {
    // Setup single instance lock (if not skipped)
    if (!skipSingleInstance) {
      setupSingleInstance({
        onSuccess: () => {
          handleAppReady({
            onReady: async () => {
              // Initialize main window
              windowManager.initialize(windowConfig)

              // Load all services
              await loadServices()

              // Load all subapps
              await loadSubApps()

              // Handle initial command-line arguments
              handleExecuteArguments(process.argv)
            },
          }).catch((error) => {
            console.error('[App] Failed to initialize:', error.message)
            process.exit(1)
          })
        },
        onSecondInstance: createSecondInstanceHandler(),
      })
    }
    else {
      // Direct start without single instance check
      await handleAppReady({
        onReady: async () => {
          windowManager.initialize(windowConfig)
          await loadServices()
          await loadSubApps()
          handleExecuteArguments(process.argv)
        },
      })
    }
  }

  /**
   * Get main window instance
   */
  const getMainWindow = () => windowManager.getMainWindow()

  /**
   * Quit application
   */
  const quit = () => {
    app.isQuiting = true
    app.quit()
  }

  return {
    start,
    getMainWindow,
    quit,
    windowManager,
  }
}
