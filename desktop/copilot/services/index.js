import formatterManager from './formatters/index.js'
import { eventStreamManager } from './streams/index.js'
import { defaultCopilotConfigs } from '$copilot/configs/index.js'

// Get ipcxRenderer exposed from preload
const { ipcxRenderer } = window.electron

// Service name prefix (must be consistent with the main process)
const SERVICE_PREFIX = 'copilot'

/**
 * Create an IPC channel name
 * @private
 * @param {string} method - Method name
 * @returns {string} Full IPC channel name
 */
const createChannel = method => `${SERVICE_PREFIX}:${method}`

/**
 * Format error information
 * @param {string} type - Error type
 * @param {string} message - Error message
 * @returns {{code: string, message: string}} Error object
 */
export function formatError(type, message) {
  const errorTypes = {
    CONFIG_MISSING: 'CONFIG_MISSING',
    ADB_CONNECTION_FAILED: 'ADB_CONNECTION_FAILED',
    PROCESS_ERROR: 'PROCESS_ERROR',
    TIMEOUT: 'TIMEOUT',
    UNKNOWN: 'UNKNOWN',
  }

  return {
    code: errorTypes[type] || errorTypes.UNKNOWN,
    message,
  }
}

/**
 * Parse device list output (utility function, used in special cases)
 * @param {string} output - Command output
 * @returns {Array<{id: string, name: string}>} Device list
 */
export function parseDeviceList(output) {
  const lines = output.split('\n').filter(line => line.trim())
  return lines.slice(1).map((line) => {
    const id = line.trim()
    return { id, name: id }
  })
}

/**
 * CopilotClient class - Copilot service client for the renderer process
 * @class
 */
class CopilotClient {
  constructor() {
    this.formatter = formatterManager.create()
    this.preflightChecker = null // Lazy-loaded (to avoid circular dependencies)
  }

  /**
   * Invoke a main-process method (based on electron-ipcx)
   * @private
   * @param {string} method - Method name
   * @param {...any} args - Method arguments
   * @returns {Promise<any>} Execution result
   */
  _invoke(method, ...args) {
    return ipcxRenderer.invoke(createChannel(method), ...args)
  }

  /**
   * Get the PreflightChecker instance (lazy-loaded)
   * @private
   */
  async _getPreflightChecker() {
    if (!this.preflightChecker) {
      // Dynamic import to avoid circular dependency
      const module = await import('$copilot/utils/PreflightChecker.js')
      this.preflightChecker = module.preflightChecker
    }
    return this.preflightChecker
  }

  /**
   * Execute a task (supports single-device and batch execution, with preflight checks)
   *
   * **Core features**:
   * - Supports single-device and batch execution
   * - Automatically runs preflight checks (ADB keyboard, API service, etc.)
   * - Supports function callbacks via electron-ipcx (onData, onExit, onSession)
   * - Automatically formats onData output (via formatter)
   *
   * @param {string} task - Task instruction (natural language description)
   * @param {object} options - Execution options
   * @param {string|string[]} options.deviceId - Device ID (string for single device, array for batch)
   * @param {number} [options.maxSteps] - Maximum execution steps
   * @param {boolean} [options.quiet] - Quiet mode (reduced output)
   * @param {boolean} [options.skipPreflightCheck] - Skip preflight checks (single-device only, default false)
   * @param {function(string, object): void} [options.onData] - Real-time output callback
   *   - Argument 1: formatted {string} - Formatted output
   *   - Argument 2: session {object} - Session object
   * @param {function(object, object): void} [options.onExit] - Task exit callback
   *   - Argument 1: result {object} - Exit info {exitCode, signal}
   *   - Argument 2: session {object} - Session object
   * @param {function(object|object[]): void} [options.onSession] - Session creation callback
   *   - Argument: session {object|object[]} - Single session or session array
   * @param {function(object): void} [options.onPreflightFail] - Preflight check failure callback
   *   - Argument: checkResult {object} - Result {passed, failedChecks}
   * @returns {Promise<object|object[]>} Execution result (object for single device, array for batch)
   * @throws {Error} Thrown when preflight checks fail or execution errors occur
   */
  async execute(task, options = {}) {
    const {
      deviceId,
      skipPreflightCheck = false,
      onPreflightFail,
      onData,
      onExit,
      onSession,
      ...restOptions
    } = options

    // Preflight checks (single-device only)
    if (!skipPreflightCheck && !Array.isArray(deviceId)) {
      const config = await this.getConfig()
      const checker = await this._getPreflightChecker()
      const subscribeStore = useSubscribeStore()

      await subscribeStore.init()

      const checkResult = await checker.runAll({
        deviceId,
        copilotConfig: config,
        subscribeStore,
      })

      // If checks fail, trigger callback and block execution
      if (!checkResult.passed) {
        console.warn('[CopilotClient] Preflight check failed:', checkResult.failedChecks)

        if (onPreflightFail) {
          onPreflightFail(checkResult)
        }

        const firstFail = checkResult.failedChecks[0]
        throw new Error(firstFail.message || 'Preflight check did not pass')
      }
    }

    const wrappedOnData = onData
      ? (payload, session) => {
          const formatted = this.formatter.format(
            payload.event,
            payload.payload,
            payload.context,
          )
          onData(formatted, { session, payload })
        }
      : void 0

    const wrappedOnExit = (result) => {
      eventStreamManager.remove(result?.session?.id)
      onExit(result)
    }

    return this._invoke('execute', task, {
      deviceId,
      ...restOptions,
      onData: wrappedOnData,
      onExit: wrappedOnExit,
      onSession,
    })
  }

  /**
   * Stop the current task on a device
   *
   * @param {string} deviceId - Device ID
   * @param {string} [reason] - Abort reason (optional, default: 'User aborted')
   * @returns {Promise<void>}
   */
  stop(deviceId, reason = 'User aborted') {
    return this._invoke('stop', deviceId, reason)
  }

  /**
   * Destroy the session for a specific device
   *
   * @param {string} deviceId - Device ID
   * @returns {Promise<void>}
   */
  destroy(deviceId) {
    return this._invoke('destroy', deviceId)
  }

  /**
   * Destroy all sessions
   *
   * @returns {Promise<void>}
   */
  destroyAll() {
    return this._invoke('destroyAll')
  }

  /**
   * Get session information by device
   */
  getSessionByDevice(deviceId) {
    return this._invoke('getSessionByDevice', deviceId)
  }

  /**
   * Get all active sessions
   */
  getActiveSessions() {
    return this._invoke('getActiveSessions')
  }

  getConfig() {
    const stored = window.appStore.get('copilot') || {}

    return {
      ...defaultCopilotConfigs,
      ...stored,
    }
  }

  setConfig(value, key) {
    if (key) {
      window.appStore.set(`copilot.${key}`, value)
    }
    else {
      window.appStore.set('copilot', value)
    }
  }

  /**
   * Check whether the ADB keyboard is installed
   *
   * @param {string} deviceId - Device ID
   * @returns {Promise<boolean>} Whether it is installed
   */
  checkKeyboard(deviceId) {
    return this._invoke('checkKeyboard', deviceId)
  }

  /**
   * Install the ADB keyboard on the device
   *
   * @param {string} deviceId - Device ID
   * @returns {Promise<{success: boolean, message: string}>} Installation result
   */
  installKeyboard(deviceId) {
    return this._invoke('installKeyboard', deviceId)
  }

  /**
   * Check API service availability
   *
   * @param {object} config - API configuration
   * @param {string} config.baseUrl - API base URL
   * @param {string} config.apiKey - API key
   * @param {string} config.model - Model name
   * @returns {Promise<{success: boolean, message: string}>} Check result
   */
  checkModelApi(config) {
    return this._invoke('checkModelApi', config)
  }

  /**
   * Set idle timeout (session manager configuration)
   *
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<boolean>} Whether the setting was successful
   */
  setIdleTimeout(timeout) {
    return this._invoke('setIdleTimeout', timeout)
  }

  /**
   * Get system status (for debugging)
   *
   * @returns {Promise<object>} System status
   *   - sessionCount {number} - Number of active sessions
   *   - subscriptionCount {number} - Number of subscriptions
   *   - queuedTasks {number} - Number of queued tasks
   */
  getSystemStats() {
    return this._invoke('getSystemStats')
  }

  // Utility functions (exposed)
  formatError = formatError
  parseDeviceList = parseDeviceList
}

// Create and export singleton
const copilotClient = new CopilotClient()

export default copilotClient
