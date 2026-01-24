/**
 * Single Instance Manager
 * Ensures only one instance of the application runs
 */

import { ensureSingleInstance } from '$electron/helpers/single.js'
import { globalEventEmitter } from '$electron/helpers/emitter/index.js'

/**
 * Setup single instance lock
 * @param {Object} callbacks
 * @param {Function} callbacks.onSuccess - Called when instance lock acquired
 * @param {Function} callbacks.onSecondInstance - Called when second instance detected
 * @returns {void}
 */
export function setupSingleInstance({ onSuccess, onSecondInstance }) {
  ensureSingleInstance({
    onSuccess() {
      onSuccess?.()
    },
    onShowWindow(mainWindow, commandLine, next) {
      // Handle second instance activation
      if (onSecondInstance) {
        const shouldShow = onSecondInstance(mainWindow, commandLine)
        if (shouldShow !== false) {
          next()
          globalEventEmitter.emit('tray:destroy')
        }
      }
      else {
        // Default behavior: show window and destroy tray
        next()
        globalEventEmitter.emit('tray:destroy')
      }
    },
  })
}
