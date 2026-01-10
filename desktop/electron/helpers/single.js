import { app, BrowserWindow } from 'electron'

/**
 * Utility to ensure the Electron app runs as a single instance
 * @typedef {Object} SingleInstanceOptions
 * @property {Function} [onSecondInstance] - Callback when a second instance is launched
 * @property {boolean} [enableSandbox=false] - Whether to enable sandbox mode
 * @property {Function} [onSuccess] - Callback after acquiring the single-instance lock
 * @property {Function} [onShowWindow] - Callback when main window should be shown
 * @property {boolean} [forceFocus=true] - Whether to force-focus an existing window
 * @property {boolean} [silentMode=false] - Silent mode, suppress logs
 * @property {Function} [onError] - Error handler callback
 */

/**
 * Callback type for a second instance launch
 * @callback OnSecondInstanceCallback
 * @param {Event} event - Electron event object
 * @param {string[]} commandLine - Command line arguments array
 * @param {string} workingDirectory - Working directory
 * @param {BrowserWindow|null} mainWindow - Main window instance, if available
 */

/**
 * Ensure the application runs as a single instance
 * @param {SingleInstanceOptions} options - Options
 * @returns {boolean} Whether the single-instance lock was acquired
 *
 * @example
 * // Basic usage
 * ensureSingleInstance({
 *     onSuccess: () => {
 *         app.whenReady().then(createWindow)
 *     }
 * });
 *
 * @example
 * // Advanced usage
 * ensureSingleInstance({
 *     onSecondInstance: (event, commandLine, workingDirectory, mainWindow) => {
 *         if (mainWindow) {
 *             mainWindow.webContents.send('new-instance-launched', commandLine);
 *         }
 *     },
 *     onSuccess: () => {
 *         console.log('Successfully acquired lock');
 *         createWindow();
 *     },
 *     onError: (error) => {
 *         console.error('Error in single instance check:', error);
 *     },
 *     forceFocus: true,
 *     silentMode: false
 * });
 *
 * @throws {Error} If called outside an Electron environment
 */
function ensureSingleInstance(options = {}) {
  // Destructure options and set defaults
  const {
    onSecondInstance,
    enableSandbox = false,
    onSuccess,
    onShowWindow,
    onError,
    forceFocus = true,
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
      onSuccess?.()
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
        // Get all windows
        const windows = BrowserWindow.getAllWindows()

        const mainWindow = windows.find(item => item.customId === 'mainWindow')

        const showWindowNext = () => {
          if (mainWindow) {
            if (mainWindow.isMinimized() || !mainWindow.isVisible()) {
              mainWindow.show()
            }
            if (forceFocus) {
              mainWindow.focus()
            }
          }
        }

        // Handle window focus
        if (onShowWindow) {
          onShowWindow?.(mainWindow, commandLine, showWindowNext)
        }
        else {
          showWindowNext()
        }

        // Invoke user-defined callback
        onSecondInstance?.(event, commandLine, workingDirectory, mainWindow)
      }
      catch (error) {
        !silentMode && console.error('Error handling second instance:', error)
        onError?.(error)
      }
    })

    // Invoke success callback
    onSuccess?.()
    return true
  }
  catch (error) {
    !silentMode && console.error('Error in ensureSingleInstance:', error)
    onError?.(error)
    return false
  }
}

/**
 * Check if current process is the main application instance
 * @returns {boolean} Returns true when running as main instance
 */
function isMainInstance() {
  return app.requestSingleInstanceLock()
}

/**
 * Release the single-instance lock to allow other instances to start
 * @returns {void}
 */
function releaseSingleInstanceLock() {
  app.releaseSingleInstanceLock()
}

export {
  ensureSingleInstance,
  isMainInstance,
  releaseSingleInstanceLock,
}
