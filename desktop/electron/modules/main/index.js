import { app as electronApp } from 'electron'
import remote from '@electron/remote/main'
import { createWindowManager } from '@escrcpy/electron-modularity/main'

export default {
  name: 'module:main',
  apply(app) {
    // Initialize @electron/remote once
    if (!app?.hasService?.('remote:initialized')) {
      remote.initialize()
      app?.provide?.('remote:initialized', true)
    }

    // Create main window manager with configuration
    const manager = createWindowManager('main', {
      app,
      singleton: true,
      mainWindow: true, // Auto-register as main window and set browserWindow.main
      browserWindow: {
        persistenceBounds: true,
      },
      hooks: {
        created(win) {
          const mainWindow = win?.raw

          if (!mainWindow) {
            console.error('[module:main] Failed to get browser window instance')
            return
          }

          // Enable @electron/remote for main window
          try {
            remote.enable(mainWindow.webContents)
          }
          catch (error) {
            console.warn('[module:main] remote enable failed:', error?.message || error)
          }
        },
        ready(win) {
          // Show window when ready
          win.show?.()

          // Emit lifecycle:ready event to trigger execute-arguments processing
          app?.emit?.('lifecycle:ready')
        },
      },
    })

    // Open main window when singleton is ready
    app?.once?.('singleton:ready', async () => {
      try {
        await electronApp.whenReady()
        manager.open({ show: false })
      }
      catch (error) {
        console.error('[module:main] Error opening main window:', error)
      }
    })
  },
}
