import { BrowserWindow, app as electronApp } from 'electron'
import { optimizer } from '@electron-toolkit/utils'
import { resolveMainWindow } from '@escrcpy/electron-modularity/main'
import { globalEventEmitter } from '$electron/helpers/emitter/index.js'

export default {
  name: 'service:lifecycle',
  async apply(appContext) {
    const mainWindow = await resolveMainWindow(appContext)

    if (!mainWindow) {
      console.warn('[lifecycle] main window not available')
      return
    }

    // Platform adapter for macOS dock operations
    const platformAdapter = {
      showDock() {
        if (process.platform === 'darwin') {
          electronApp.dock.show()
        }
      },
      hideDock() {
        if (process.platform === 'darwin') {
          electronApp.dock.hide()
        }
      },
    }

    /**
     * Run execute arguments handling
     * Reference: desktop/electron.bak/main.js#L126-L162
     */
    const runExecuteArguments = (commandLine = process.argv) => {
      try {
        const executeArgsService = appContext?.inject?.('plugin:execute-arguments')

        if (!executeArgsService) {
          console.warn('[lifecycle] execute-arguments plugin not available')
          return null
        }

        // Parse command line arguments
        const args = executeArgsService.parseExecuteArguments?.(commandLine)

        if (!args) {
          console.warn('[lifecycle] Failed to parse execute arguments')
          return null
        }

        // Inject arguments into environment variables
        executeArgsService.injectExecuteArguments?.(args)

        // Handle minimized argument - create tray
        if (args.minimized === true) {
          globalEventEmitter.emit('tray:create')
        }

        // Send IPC message to renderer process
        if (mainWindow?.webContents && !mainWindow.isDestroyed?.()) {
          mainWindow.webContents.send('execute-arguments-change', {
            deviceId: args['device-id'],
            appName: args['app-name'],
            packageName: args['package-name'],
          })

          // If device-id exists, trigger auto-start-app
          if (args['device-id']) {
            mainWindow.webContents.send('auto-start-app')
          }
        }

        return args
      }
      catch (error) {
        console.error('[lifecycle] Failed to run execute arguments:', error?.message || error)
        return null
      }
    }

    // ==================== Lifecycle Event Handlers ====================

    /**
     * web-contents-created event
     * Reference: desktop/electron.bak/main.js#L90-L92
     * Enable keyboard shortcut monitoring for all windows
     */
    electronApp.on('web-contents-created', (_, webContents) => {
      optimizer.watchWindowShortcuts(webContents)
    })

    /**
     * activate event (macOS)
     * Reference: desktop/electron.bak/main.js#L95-L103
     * Restore window when clicking dock icon
     */
    electronApp.on('activate', () => {
      // If no windows exist, let singleton plugin handle window creation
      if (BrowserWindow.getAllWindows().length === 0) {
        return
      }

      // Show and focus main window
      mainWindow?.show?.()
      mainWindow?.focus?.()

      // Show dock on macOS
      platformAdapter.showDock()

      // Destroy tray when window is activated
      globalEventEmitter.emit('tray:destroy')
    })

    /**
     * window-all-closed event
     * Reference: desktop/electron.bak/main.js#L106-L110
     * Quit application when all windows are closed
     */
    electronApp.on('window-all-closed', () => {
      electronApp.isQuiting = true
      electronApp.quit()
    })

    // ==================== Initial Execute Arguments ====================

    /**
     * Run execute arguments on first launch
     * This is called after main window is ready
     */
    appContext?.once?.('lifecycle:ready', () => {
      runExecuteArguments(process.argv)
    })

    // Provide runExecuteArguments for singleton plugin
    appContext?.provide?.('lifecycle:runExecuteArguments', runExecuteArguments)
    appContext?.provide?.('lifecycle:platformAdapter', platformAdapter)

    console.log('[lifecycle] service initialized')
  },
}
