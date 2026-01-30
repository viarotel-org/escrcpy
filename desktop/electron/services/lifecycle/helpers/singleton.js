import { app, BrowserWindow } from 'electron'

/**
 * Ensure the application runs as a single instance
 *
 * @param {Object} options
 * @param {(event: Event, commandLine: string[], workingDirectory: string) => void} [options.onSecondInstance]
 *        Callback when a second instance is launched
 * @param {boolean} [options.enableSandbox]
 *        Whether to enable sandbox mode (skips single instance check)
 * @param {() => void} [options.onCreateWindow]
 *        Callback after acquiring the singleton lock
 * @param {(commandLine: string[], next: () => void) => void} [options.onShowWindow]
 *        Callback when main window should be shown
 * @param {boolean} [options.silentMode]
 *        Silent mode, suppress logs
 * @param {(error: Error) => void} [options.onError]
 *        Error handler callback
 *
 * @returns {boolean} Whether the singleton lock was acquired
 *
 * @throws {Error} If called outside an Electron environment
 */
export function ensureSingleInstance(options = {}) {
  const {
    onSecondInstance,
    enableSandbox = false,
    onCreateWindow,
    onShowWindow,
    onError,
    silentMode = false,
  } = options

  // Validate runtime environment
  if (!app || !BrowserWindow) {
    const error = new Error('ensureSingleInstance must be called in Electron environment')
    if (onError) {
      onError(error)
      return false
    }
    throw error
  }

  try {
    // Sandbox mode check
    if (enableSandbox) {
      !silentMode && console.log('Sandbox mode enabled, skipping single instance check')
      onCreateWindow && onCreateWindow()
      return true
    }

    // Request single instance lock
    const gotTheLock = app.requestSingleInstanceLock()

    // If lock cannot be obtained, another instance is already running
    if (!gotTheLock) {
      !silentMode && console.log('Application instance already running, quitting...')
      app.quit()
      return false
    }

    // Listen for second instance launch
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      try {
        const defaultShowNext = () => {
          !silentMode
          && console.warn(
            'No onShowWindow handler provided, second instance detected but window not focused',
          )
        }

        // Delegate window handling
        if (onShowWindow) {
          onShowWindow(commandLine, defaultShowNext)
        }

        // Legacy callback
        if (onSecondInstance) {
          onSecondInstance(event, commandLine, workingDirectory)
        }
      }
      catch (error) {
        !silentMode && console.error('Error handling second instance:', error)
        onError && onError(error)
      }
    })

    onCreateWindow && onCreateWindow()
    return true
  }
  catch (error) {
    !silentMode && console.error('Error in ensureSingleInstance:', error)
    onError && onError(error)
    return false
  }
}

/**
 * Check if current process is the main application instance
 *
 * @returns {boolean} Returns true when running as main instance
 */
export function isMainInstance() {
  return app.requestSingleInstanceLock()
}

/**
 * Release the singleton lock to allow other instances to start
 */
export function releaseSingleInstanceLock() {
  app.releaseSingleInstanceLock()
}
