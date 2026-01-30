import { BrowserWindow, app as electronApp } from 'electron'
import remote from '@electron/remote/main'
import { optimizer } from '@electron-toolkit/utils'
import { globalEventEmitter } from '$electron/helpers/emitter/index.js'
import { ensureSingleInstance, injectExecuteArguments, parseExecuteArguments, restoreAndFocusWindow } from './helpers/index.js'
import { resolveMainWindow } from '@escrcpy/electron-modularity/main'

export default {
  name: 'service:lifecycle',
  deps: ['module:main'],
  apply(appContext) {
    const windowManager = appContext.getWindowManager('main')

    ensureSingleInstance({
      onSuccess() {
        openMainWindow()
      },
      onShowWindow(commandLine) {
        showMainWindow(commandLine)
      },
    })

    async function openMainWindow() {
      await electronApp.whenReady()

      windowManager.open({ show: false })

      const mainWindow = await resolveMainWindow(appContext)

      if (!appContext?.hasService?.('remote:initialized')) {
        appContext?.provide?.('remote:initialized', true)
        remote.initialize()
        remote.enable(mainWindow.webContents)
      }

      runExecuteArguments(process.argv, mainWindow)

      mainWindow.show?.()
    }

    async function showMainWindow(commandLine) {
      const mainWindow = await resolveMainWindow(appContext)

      const args = runExecuteArguments(commandLine, mainWindow)

      if (!args['device-id']) {
        restoreAndFocusWindow(mainWindow)
      }
    }

    /**
     * Enable keyboard shortcut monitoring for all windows
     */
    electronApp.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    /**
     * activate event (macOS)
     * Restore window when clicking dock icon
     */
    electronApp.on('activate', async () => {
      // If no windows exist, let singleton plugin handle window creation
      if (BrowserWindow.getAllWindows().length === 0) {
        return
      }

      const mainWindow = await resolveMainWindow(appContext)

      restoreAndFocusWindow(mainWindow)
    })

    /**
     * window-all-closed event
     * Quit application when all windows are closed
     */
    electronApp.on('window-all-closed', () => {
      electronApp.isQuiting = true
      electronApp.quit()
    })

    /**
     * Run execute arguments handling
     */
    function runExecuteArguments(commandLine = '', mainWindow) {
      try {
        // Parse command line arguments
        const args = parseExecuteArguments(commandLine)

        if (!args) {
          console.warn('[lifecycle] Failed to parse execute arguments')
          return null
        }

        // Inject arguments into environment variables
        injectExecuteArguments(args)

        // Handle minimized argument - create tray
        if (args.minimized) {
          globalEventEmitter.emit('tray:create')
        }

        // Send IPC message to renderer process
        if (mainWindow?.webContents && !mainWindow.isDestroyed?.()) {
          mainWindow.webContents.send('execute-arguments-change', {
            deviceId: args['device-id'],
            appName: args['app-name'],
            packageName: args['package-name'],
          })
        }

        return args
      }
      catch (error) {
        console.error('[lifecycle] Failed to run execute arguments:', error?.message || error)
        return null
      }
    }
  },
}
