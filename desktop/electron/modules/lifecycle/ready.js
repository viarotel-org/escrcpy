/**
 * Application Ready Handler
 * Manages app initialization after Electron ready event
 */

import { app, BrowserWindow } from 'electron'
import { optimizer } from '@electron-toolkit/utils'
import { configureSandbox } from './sandbox.js'

/**
 * Handle app ready event
 * @param {Object} options
 * @param {Function} options.onReady - Callback when app is ready
 * @param {Function} options.beforeReady - Optional callback before ready
 * @param {Function} options.afterReady - Optional callback after ready
 * @returns {Promise<void>}
 */
export async function handleAppReady(options = {}) {
  const { onReady, beforeReady, afterReady } = options

  // Execute before ready hook
  if (beforeReady) {
    await beforeReady()
  }

  // Configure sandbox before app initialization
  await configureSandbox()

  // Wait for app ready
  await app.whenReady()

  // Execute main ready callback
  if (onReady) {
    await onReady()
  }

  // Setup window shortcuts watcher
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Execute after ready hook
  if (afterReady) {
    await afterReady()
  }
}

/**
 * Setup app lifecycle event listeners
 * @param {Object} handlers
 * @param {Function} handlers.onActivate - macOS activate handler
 * @param {Function} handlers.onWindowAllClosed - All windows closed handler
 */
export function setupAppLifecycle(handlers = {}) {
  const { onActivate, onWindowAllClosed } = handlers

  if (onActivate) {
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        onActivate()
      }
    })
  }

  if (onWindowAllClosed) {
    app.on('window-all-closed', () => {
      onWindowAllClosed()
    })
  }
}
