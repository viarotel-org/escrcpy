import { app, BrowserWindow } from 'electron'

/**
 * Options for single instance management
 */
export interface SingleInstanceOptions {
  /**
   * Callback when a second instance is launched
   */
  onSecondInstance?: (event: Event, commandLine: string[], workingDirectory: string) => void

  /**
   * Whether to enable sandbox mode (skips single instance check)
   * @default false
   */
  enableSandbox?: boolean

  /**
   * Callback after acquiring the singleton lock
   */
  onSuccess?: () => void

  /**
   * Callback when main window should be shown
   * @param mainWindow - Main window instance
   * @param commandLine - Command line arguments
   * @param next - Call this to show and focus window
   */
  onShowWindow?: (commandLine: string[], next: () => void) => void

  /**
   * Silent mode, suppress logs
   * @default false
   */
  silentMode?: boolean

  /**
   * Error handler callback
   */
  onError?: (error: Error) => void
}

/**
 * Ensure the application runs as a single instance
 *
 * @param options - Configuration options
 * @returns Whether the singleton lock was acquired
 *
 * @example
 * ```ts
 * // Basic usage
 * ensureSingleInstance({
 *   onSuccess: () => {
 *     app.whenReady().then(createWindow)
 *   }
 * })
 * ```
 *
 * @example
 * ```ts
 * // Advanced usage
 * ensureSingleInstance({
 *   onSecondInstance: (event, commandLine, workingDirectory, mainWindow) => {
 *     if (mainWindow) {
 *       mainWindow.webContents.send('new-instance-launched', commandLine)
 *     }
 *   },
 *   onSuccess: () => {
 *     console.log('Successfully acquired lock')
 *     createWindow()
 *   },
 *   onError: (error) => {
 *     console.error('Error in single instance check:', error)
 *   },
 *   forceFocus: true,
 *   silentMode: false
 * })
 * ```
 *
 * @throws {Error} If called outside an Electron environment
 */
export function ensureSingleInstance(options: SingleInstanceOptions = {}): boolean {
  // Destructure options and set defaults
  const {
    onSecondInstance,
    enableSandbox = false,
    onSuccess,
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
        // Note: mainWindow will be provided by the callback handler
        // This helper is now decoupled from specific window resolution logic
        // The caller is responsible for providing the window via onShowWindow callback

        // Default fallback handler that does nothing (caller should provide onShowWindow)
        const defaultShowNext = () => {
          !silentMode && console.warn('No onShowWindow handler provided, second instance detected but window not focused')
        }

        // Delegate window handling to the callback
        if (onShowWindow) {
          onShowWindow(commandLine, defaultShowNext)
        }

        // Invoke user-defined callback (legacy support)
        if (onSecondInstance) {
          onSecondInstance(event as any, commandLine, workingDirectory)
        }
      }
      catch (error: any) {
        !silentMode && console.error('Error handling second instance:', error)
        onError?.(error)
      }
    })

    // Invoke success callback
    onSuccess?.()
    return true
  }
  catch (error: any) {
    !silentMode && console.error('Error in ensureSingleInstance:', error)
    onError?.(error)
    return false
  }
}

/**
 * Check if current process is the main application instance
 * @returns Returns true when running as main instance
 */
export function isMainInstance(): boolean {
  return app.requestSingleInstanceLock()
}

/**
 * Release the singleton lock to allow other instances to start
 */
export function releaseSingleInstanceLock(): void {
  app.releaseSingleInstanceLock()
}
