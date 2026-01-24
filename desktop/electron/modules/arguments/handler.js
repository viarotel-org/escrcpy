/**
 * Arguments Handler
 * Process and dispatch execute arguments
 */

import { globalEventEmitter } from '$electron/helpers/emitter/index.js'
import { extractExecuteArguments, hasDeviceLaunchArgs } from './parser.js'
import { injectEnvironmentVariables } from './injector.js'
import { getMainWindow } from '../window/index.js'

/**
 * Handle execute arguments for main window
 * @param {string[]} commandLine - Command-line arguments
 * @returns {Object} Processed execute arguments
 */
export function handleExecuteArguments(commandLine) {
  const executeArgs = extractExecuteArguments(commandLine)

  // Inject into environment variables
  injectEnvironmentVariables(executeArgs)

  // Handle minimized flag
  if (executeArgs.minimized) {
    globalEventEmitter.emit('tray:create')
  }

  // Send to renderer process
  const mainWindow = getMainWindow()
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('execute-arguments-change', {
      deviceId: executeArgs.deviceId,
      appName: executeArgs.appName,
      packageName: executeArgs.packageName,
    })
  }

  return executeArgs
}

/**
 * Setup execute arguments handler for second instance
 * @param {Function} callback - Optional callback when arguments processed
 * @returns {Function} Handler function
 */
export function createSecondInstanceHandler(callback) {
  return (mainWindow, commandLine) => {
    const executeArgs = handleExecuteArguments(commandLine)

    // Invoke callback if provided
    callback?.(executeArgs, mainWindow)

    // Return whether to show window (don't show if launching device directly)
    return !hasDeviceLaunchArgs(executeArgs)
  }
}
