/**
 * Copilot IPC Handlers
 * Handles Copilot-related IPC communication between the renderer process
 * and the main process.
 *
 * @module CopilotHandlers
 */

import { ipcxMain } from '@escrcpy/electron-ipcx/main'

import copilotService from './index.js'
import { createOrGetAgent } from './modules/index.js'
import { adbKeyboardApkPath } from '$electron/configs/index.js'

/** Service name prefix */
const SERVICE_PREFIX = 'copilot'

/** Log prefix */
const LOG_PREFIX = '[CopilotHandlers]'

/**
 * Create an IPC channel name
 * @param {string} method - Method name
 * @returns {string} - Full IPC channel name
 */
const createChannel = method => `${SERVICE_PREFIX}:${method}`

/**
 * Unified error handling
 * @param {string} operation - Operation name
 * @param {Error} error - Error object
 * @throws {Error} Rethrows the error
 */
function handleError(operation, error) {
  console.error(`${LOG_PREFIX} ${operation} failed:`, error)
  throw error
}

/**
 * Safely execute an asynchronous operation
 * @param {string} operation - Operation name
 * @param {Function} fn - Asynchronous function
 * @returns {Promise<*>} Execution result
 */
async function safeExecute(operation, fn) {
  try {
    return await fn()
  }
  catch (error) {
    handleError(operation, error)
  }
}

/**
 * Register all Copilot-related IPC handlers
 * @param {Electron.BrowserWindow} [mainWindow] - Main window instance (optional, for special cases)
 */
export function registerCopilotHandlers(mainWindow) {
  /**
   * Execute a task (supports single-device and batch execution)
   */
  ipcxMain.handle(createChannel('execute'), async (_event, task, options = {}) => {
    return safeExecute('execute', () =>
      copilotService.execute(task, options),
    )
  })

  /**
   * Stop the current task on a device
   */
  ipcxMain.handle(createChannel('stop'), async (_, deviceId, reason) =>
    safeExecute('stop', () =>
      copilotService.stop(deviceId, reason),
    ),
  )

  /**
   * Destroy a device session
   */
  ipcxMain.handle(createChannel('destroy'), async (_, deviceId) =>
    safeExecute('destroy', () =>
      copilotService.destroy(deviceId),
    ),
  )

  /**
   * Destroy all sessions
   */
  ipcxMain.handle(createChannel('destroyAll'), async () =>
    safeExecute('destroyAll', () =>
      copilotService.destroyAll(),
    ),
  )

  /**
   * Get session information for a device
   */
  ipcxMain.handle(createChannel('getSessionByDevice'), async (_, deviceId) =>
    copilotService.getSessionByDevice(deviceId),
  )

  /**
   * Get all active sessions
   */
  ipcxMain.handle(createChannel('getActiveSessions'), async () =>
    copilotService.getActiveSessions(),
  )

  /**
   * Check whether the ADB keyboard is installed
   */
  ipcxMain.handle(createChannel('checkKeyboard'), async (_, deviceId) =>
    safeExecute('checkKeyboard', async () => {
      const agent = await createOrGetAgent({ deviceId })
      const result = await agent.adb.isKeyboardInstalled()

      // Automatically install if not installed
      if (!result?.success) {
        agent.adb.installKeyboard(adbKeyboardApkPath)
      }

      return result?.success || false
    }),
  )

  /**
   * Install the ADB keyboard
   */
  ipcxMain.handle(createChannel('installKeyboard'), async (_, deviceId) =>
    safeExecute('installKeyboard', async () => {
      const agent = await createOrGetAgent({ deviceId })
      await agent.adb.installKeyboard(adbKeyboardApkPath)
      return await agent.adb.isKeyboardInstalled()
    }),
  )

  /**
   * Check the model API service
   */
  ipcxMain.handle(createChannel('checkModelApi'), async (_, config) =>
    safeExecute('checkModelApi', async () => {
      const agent = await createOrGetAgent({
        baseUrl: config.baseUrl,
        apiKey: config.apiKey,
        model: config.model,
      })
      return await agent.checkModelApi()
    }),
  )

  /**
   * Set idle timeout
   */
  ipcxMain.handle(createChannel('setIdleTimeout'), async (_, timeout) => {
    copilotService.setIdleTimeout(timeout)
    return true
  })
}

/**
 * Unregister all Copilot IPC handlers
 * Used for scenarios such as hot reloading
 */
export function unregisterCopilotHandlers() {
  const methods = [
    'execute',
    'stop',
    'destroy',
    'destroyAll',
    'getSessionByDevice',
    'getActiveSessions',
    'checkKeyboard',
    'installKeyboard',
    'checkModelApi',
    'setIdleTimeout',
  ]

  methods.forEach((method) => {
    ipcxMain.removeHandler(createChannel(method))
  })
}
