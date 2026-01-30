import type { BrowserWindow } from 'electron'
import type { ElectronApp, Plugin } from '../../main/types'
import { ensureSingleInstance } from './helper'

/**
 * Singleton plugin options
 */
export interface SingletonPluginOptions {
  /**
   * Custom service name for dependency injection
   * @default ''
   */
  serviceName?: string

  /**
   * Custom event name emitted when singleton is ready
   * @default 'singleton:ready'
   */
  readyEventName?: string

  /**
   * Custom IPC channel for execute arguments update
   * @default 'execute-arguments-change'
   */
  executeArgsUpdateChannel?: string

  /**
   * Custom IPC channel for auto-start signal
   * @default 'auto-start-app'
   */
  autoStartChannel?: string

  /**
   * Whether to force-focus window when second instance is launched
   * @default true
   */
  forceFocus?: boolean

  /**
   * Silent mode, suppress logs
   * @default false
   */
  silentMode?: boolean

  /**
   * Custom window ID to find main window
   * @default 'main'
   */
  mainWindowId?: string
}

/**
 * Single instance management plugin
 *
 * Ensures only one instance of the application runs at a time.
 * When a second instance is launched, it activates the existing window
 * and handles command-line arguments.
 *
 * @example
 * ```ts
 * import { createElectronApp } from '@escrcpy/electron-modularity'
 * import { singletonPlugin, executeArgumentsPlugin } from '@escrcpy/electron-modularity/plugins'
 *
 * const app = createElectronApp({ ... })
 *
 * // Must load execute-arguments plugin first
 * app.use(executeArgumentsPlugin)
 * app.use(singletonPlugin)
 *
 * // Listen for singleton ready event
 * app.on('singleton:ready', () => {
 *   console.log('Singleton lock acquired, safe to create window')
 * })
 * ```
 *
 * ## Dependency
 * This plugin depends on `plugin:execute-arguments` to parse
 * command-line arguments from second instance launches.
 *
 * ## Second Instance Behavior
 * - If `--device-id` is provided: sends `auto-start-app` IPC message
 * - Otherwise: shows and focuses the main window
 */
export const singletonPlugin: Plugin<void, SingletonPluginOptions> = {
  name: 'plugin:singleton',
  order: -50, // Load before most plugins
  deps: ['plugin:execute-arguments'],

  apply(app: ElectronApp, options: SingletonPluginOptions = {}) {
    const {
      serviceName = '',
      readyEventName = 'singleton:ready',
      executeArgsUpdateChannel = 'execute-arguments-change',
      autoStartChannel = 'auto-start-app',
      forceFocus = true,
      silentMode = false,
      mainWindowId = 'main',
    } = options

    // Override plugin name if custom service name is provided
    if (serviceName) {
      singletonPlugin.name = serviceName
    }

    function onAppStarted() {
      let mainWindow: BrowserWindow | null = null

      ensureSingleInstance({
        /**
         * Called when first instance successfully acquires the lock
         */
        onSuccess() {
          app?.emit?.(readyEventName)
        },

        /**
         * Called when a second instance tries to launch
         */
        onShowWindow(existingMainWindow: BrowserWindow | null, commandLine: string[], next: () => void) {
          try {
            console.log('[plugin:singleton] Second instance detected, handling parameters')

            // Store reference to main window if available
            if (existingMainWindow) {
              mainWindow = existingMainWindow
            }
            else {
              // Try to get window from manager if not provided
              const manager = app?.getWindowManager?.(mainWindowId)
              if (manager) {
                const win: any = manager.get?.() || null
                mainWindow = win?.raw
              }
            }

            const executeArgsService = app?.inject?.('plugin:execute-arguments') as any

            // Parse and inject new arguments from second instance
            if (executeArgsService) {
              const newArgs = executeArgsService.parseExecuteArguments(commandLine)
              executeArgsService.injectExecuteArguments(newArgs)

              // Send updated arguments to renderer process
              if (mainWindow?.webContents && !mainWindow.isDestroyed?.()) {
                try {
                  mainWindow.webContents.send(executeArgsUpdateChannel, {
                    deviceId: newArgs['device-id'],
                    appName: newArgs['app-name'],
                    packageName: newArgs['package-name'],
                  })
                }
                catch (error: any) {
                  console.warn('[plugin:singleton] Failed to send arguments to renderer:', error?.message)
                }
              }

              // Behavior: If second instance has device-id parameter, auto-start app
              // Otherwise, show window and destroy tray if present
              if (newArgs['device-id']) {
                // Auto-start the app with provided device parameters
                if (mainWindow?.webContents && !mainWindow.isDestroyed?.()) {
                  try {
                    mainWindow.webContents.send(autoStartChannel)
                  }
                  catch (error: any) {
                    console.warn('[plugin:singleton] Failed to send auto-start signal:', error?.message)
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
              console.warn('[plugin:singleton] Execute arguments service not available')
              next()
            }
          }
          catch (error) {
            console.error('[plugin:singleton] Error handling second instance:', error)
            next()
          }
        },

        /**
         * Called when error occurs during single instance check
         */
        onError(error: Error) {
          console.error('[plugin:singleton] Single instance check failed:', error)
        },

        forceFocus,
        silentMode,
      })
    }

    app?.once?.('app:started', onAppStarted)
  },
}

export default singletonPlugin
