import type { BrowserWindow } from 'electron'
import type { ElectronApp, MainWindowProvider, Plugin } from '../../main/types'
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
   * Custom main window provider function
   * Use this to provide custom logic for resolving the main window
   * @default Uses app.getMainWindow()
   *
   * @example
   * ```ts
   * // Using window manager
   * app.use(singletonPlugin, {
   *   mainWindowProvider: () => {
   *     const manager = app.getWindowManager('control')
   *     return manager?.get()
   *   }
   * })
   *
   * // Using dependency injection
   * app.use(singletonPlugin, {
   *   mainWindowProvider: () => app.inject('window:custom')
   * })
   * ```
   */
  mainWindowProvider?: MainWindowProvider
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
 *
 * // Option 1: Use default behavior (app.getMainWindow())
 * app.use(singletonPlugin)
 *
 * // Option 2: Provide custom main window resolver
 * app.use(singletonPlugin, {
 *   mainWindowProvider: () => {
 *     const manager = app.getWindowManager('main')
 *     return manager?.get()
 *   }
 * })
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
      mainWindowProvider,
    } = options

    // Override plugin name if custom service name is provided
    if (serviceName) {
      singletonPlugin.name = serviceName
    }

    /**
     * Resolve main window using configured provider or registered window
     */
    const resolveMainWindow = async (): Promise<BrowserWindow | null> => {
      // Use custom provider if provided
      if (mainWindowProvider) {
        const result = mainWindowProvider()
        const resolved = result instanceof Promise ? await result : result
        return resolved ?? null
      }

      // Use registered main window (recommended approach)
      const registered = app?.getMainWindow?.()
      return registered ?? null
    }

    function onAppStarted() {
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
        async onShowWindow(commandLine: string[]) {
          try {
            console.log('[plugin:singleton] Second instance detected, handling parameters')

            // Resolve main window using configured strategy
            const mainWindow = await resolveMainWindow()

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
              // Otherwise, show and focus window
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
                // No device ID provided, show and focus the window
                restoreMainWindow(mainWindow, forceFocus)
              }
            }
            else {
              // Fallback if service is not available
              console.warn('[plugin:singleton] Execute arguments service not available')
              // Still show and focus window
              restoreMainWindow(mainWindow, forceFocus)
            }
          }
          catch (error) {
            console.error('[plugin:singleton] Error handling second instance:', error)
          }
        },

        /**
         * Called when error occurs during single instance check
         */
        onError(error: Error) {
          console.error('[plugin:singleton] Single instance check failed:', error)
        },

        silentMode,
      })
    }

    app?.once?.('app:started', onAppStarted)
  },
}

function restoreMainWindow(win: BrowserWindow | null, forceFocus: boolean) {
  if (!win) {
    return false
  }

  if (win.isMinimized?.()) {
    win.restore?.()
  }
  if (!win.isVisible?.()) {
    win.show?.()
  }
  if (forceFocus) {
    win.focus?.()
  }
}

export default singletonPlugin
