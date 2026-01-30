import { ensureSingleInstance } from './helper.js'

let mainWindow = null
let isInitialized = false

export default {
  name: 'module:singleton',
  deps: ['service:execute-arguments'],
  apply(app) {
    const executeArgsService = app?.inject?.('service:execute-arguments')

    app?.once?.('app:started', () => {
      ensureSingleInstance({
        /**
         * Called when first instance successfully acquires the lock
         */
        onSuccess() {
          isInitialized = true
        },

        /**
         * Called when a second instance tries to launch
         * At this point, windowManager('main') should be available
         */
        onShowWindow(existingMainWindow, commandLine, next) {
          try {
            console.log('[module:singleton] Second instance detected, handling parameters')

            // Store reference to main window if available
            if (existingMainWindow) {
              mainWindow = existingMainWindow
            }
            else {
              // Try to get window from manager if not provided
              const manager = app?.getWindowManager?.('main')
              if (manager) {
                mainWindow = manager.get?.()
              }
            }

            // Parse and inject new arguments from second instance
            if (executeArgsService) {
              const newArgs = executeArgsService.parseExecuteArguments(commandLine)
              executeArgsService.injectExecuteArguments(newArgs)

              // Send updated arguments to renderer process
              if (mainWindow?.webContents && !mainWindow.isDestroyed?.()) {
                try {
                  mainWindow.webContents.send('execute-arguments-change', {
                    deviceId: newArgs['device-id'],
                    appName: newArgs['app-name'],
                    packageName: newArgs['package-name'],
                  })
                }
                catch (error) {
                  console.warn('[module:singleton] Failed to send arguments to renderer:', error?.message)
                }
              }

              // Behavior: If second instance has device-id parameter, auto-start app
              // Otherwise, show window and destroy tray if present
              if (newArgs['device-id']) {
                // Auto-start the app with provided device parameters
                if (mainWindow?.webContents && !mainWindow.isDestroyed?.()) {
                  try {
                    mainWindow.webContents.send('auto-start-app')
                  }
                  catch (error) {
                    console.warn('[module:singleton] Failed to send auto-start signal:', error?.message)
                  }
                }
              }
              else {
                // No device ID provided, just show the window
                next()
              }
            }
            else {
              // Fallback if service is not available
              console.warn('[module:singleton] Execute arguments service not available')
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
