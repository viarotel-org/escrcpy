/**
 * Window Manager
 * High-level window lifecycle management
 */

import { app, BrowserWindow } from 'electron'
import { globalEventEmitter } from '$electron/helpers/emitter/index.js'
import { createMainWindow } from './factory.js'
import { getMainWindow, hasWindow } from './registry.js'

/**
 * Window Manager Class
 */
class WindowManager {
  constructor() {
    this.isQuitting = false
  }

  /**
   * Initialize window manager and create main window
   * @param {Object} options - Window creation options
   * @returns {Electron.BrowserWindow}
   */
  initialize(options = {}) {
    const mainWindow = createMainWindow(options)

    this.setupLifecycleHooks(mainWindow)

    return mainWindow
  }

  /**
   * Setup window lifecycle event hooks
   * @param {Electron.BrowserWindow} mainWindow
   */
  setupLifecycleHooks(mainWindow) {
    // Handle macOS activate event
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.initialize()
        return
      }

      if (process.platform === 'darwin') {
        app.dock.show()
      }
      mainWindow.show()
      globalEventEmitter.emit('tray:destroy')
    })

    // Handle all windows closed
    app.on('window-all-closed', () => {
      this.isQuitting = true
      app.isQuiting = true
      app.quit()
    })
  }

  /**
   * Get main window instance
   * @returns {Electron.BrowserWindow | undefined}
   */
  getMainWindow() {
    return getMainWindow()
  }

  /**
   * Check if main window exists
   * @returns {boolean}
   */
  hasMainWindow() {
    return hasWindow('main')
  }

  /**
   * Show main window
   */
  showMainWindow() {
    const mainWindow = getMainWindow()
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show()
      mainWindow.focus()
    }
  }

  /**
   * Hide main window
   */
  hideMainWindow() {
    const mainWindow = getMainWindow()
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.hide()
    }
  }
}

// Export singleton instance
export const windowManager = new WindowManager()
