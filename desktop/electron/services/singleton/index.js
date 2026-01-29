/**
 * Single instance module - Ensures the app runs as a single instance.
 *
 * This module:
 * 1. Acquires singleton lock on first app startup
 * 2. Handles second instance launches with proper window focus and parameter passing
 * 3. Bridges command-line arguments from second instance to the main window
 * 4. Manages tray interaction when second instance has device parameters
 *
 * Dependencies:
 * - service:execute-arguments (required for argument parsing and injection)
 *
 * This module must run very early (order: -10) before window creation,
 * and after sandbox configuration (which runs at order: -100).
 */

import { ensureSingleInstance } from './helper.js'

let mainWindow = null
let isInitialized = false

export default {
  name: 'module:singleton',
  deps: ['service:execute-arguments'],
  apply(app) {
    return new Promise((resolve, reject) => {
      const executeArgsService = app?.inject?.('service:execute-arguments')
      const windowManager = app?.getWindowManager?.('main')

      ensureSingleInstance({
        /**
         * Called when first instance successfully acquires the lock
         */
        onSuccess() {
          isInitialized = true
          resolve()
        },

        /**
         * Called when a second instance tries to launch
         * Handles parameter passing and window focus
         */
        onShowWindow(existingMainWindow, commandLine, next) {
          try {
            // Store reference to main window if available
            if (existingMainWindow) {
              mainWindow = existingMainWindow
            }

            // Parse and inject new arguments from second instance
            if (executeArgsService) {
              const newArgs = executeArgsService.parseExecuteArguments(commandLine)
              executeArgsService.injectExecuteArguments(newArgs)

              // Send updated arguments to renderer process
              if (mainWindow?.webContents && !mainWindow.isDestroyed?.()) {
                mainWindow.webContents.send('execute-arguments-change', {
                  deviceId: newArgs['device-id'],
                  appName: newArgs['app-name'],
                  packageName: newArgs['package-name'],
                })
              }

              // Behavior: If second instance has device-id parameter, auto-start app
              // Otherwise, show window and destroy tray if present
              if (newArgs['device-id']) {
                // Auto-start the app with provided device parameters
                if (mainWindow?.webContents && !mainWindow.isDestroyed?.()) {
                  mainWindow.webContents.send('auto-start-app')
                }
              }
              else {
                // No device ID provided, just show the window
                next()
              }
            }
            else {
              // Fallback if service is not available
              next()
            }
          }
          catch (error) {
            console.error('[module:singleton] Error handling second instance:', error)
            next()
          }
        },

        /**
         * Called when error occurs during single instance check
         */
        onError(error) {
          console.error('[module:singleton] Single instance check failed:', error)
          reject(error)
        },

        /**
         * Force window focus when second instance is launched
         */
        forceFocus: true,
        silentMode: false,
      })
    })
  },
}
