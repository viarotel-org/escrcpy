/**
 * Copilot Service
 * Main entry point of the Copilot service, providing core features such as
 * device task execution and session management.
 *
 * @module CopilotService
 */
import appStore from '$electron/helpers/store.js'
import { isEqual, omit } from 'lodash-es'
import { sessionManager } from './modules/index.js'

// ==================== Type Definitions ====================

/**
 * Execution options
 * @typedef {Object} ExecuteOptions
 * @property {string|string[]} deviceId - Device ID or list of device IDs
 * @property {number} [maxSteps] - Maximum number of execution steps
 * @property {boolean} [quiet] - Quiet mode
 * @property {number} [concurrency] - Concurrency level (for batch execution)
 * @property {Function} [onSession] - Session creation callback
 * @property {Function} [onData] - Data callback
 * @property {Function} [onExit] - Exit callback
 */

/**
 * Execution result
 * @typedef {Object} ExecuteResult
 * @property {string} id - Session ID
 * @property {string} deviceId - Device ID
 * @property {boolean} isRunning - Whether the session is running
 * @property {string} currentTask - Current task
 * @property {number} createdAt - Creation timestamp
 * @property {number} lastActiveAt - Last active timestamp
 */

/**
 * Session information
 * @typedef {Object} SessionInfo
 * @property {string} id - Session ID
 * @property {string} deviceId - Device ID
 * @property {boolean} isRunning - Whether the session is running
 * @property {string|null} currentTask - Current task
 * @property {number} createdAt - Creation timestamp
 * @property {number} lastActiveAt - Last active timestamp
 */

// ==================== Copilot Service Class ====================

/**
 * Copilot Service
 * Provides core features such as task execution and session management.
 */
class CopilotService {
  constructor() {
    this.sessionManager = sessionManager

    if (this.unsubscribeCopilotApiKey) {
      this.unsubscribeCopilotApiKey()
    }

    this.unsubscribeCopilotApiKey = appStore.onDidChange('copilot', (val, oldVal) => {
      if (!this._isCopilotConfigChanged(val, oldVal)) {
        return
      }

      this.sessionManager.destroyAll()
    })
  }

  // ==================== Task Execution ====================

  /**
   * Execute a Copilot task (supports both single-device and batch execution)
   *
   * @param {string} task - Task description
   * @param {ExecuteOptions} options - Execution options
   * @returns {Promise<ExecuteResult|ExecuteResult[]>} Execution result
   */
  async execute(task, options = {}) {
    const { deviceId } = options

    // Build session configuration
    const sessionConfig = this._buildSessionConfig(options)

    // Normalize device ID list
    const deviceIds = Array.isArray(deviceId) ? deviceId : [deviceId]

    // Execute task
    return this.sessionManager.executeTaskList(
      task,
      deviceIds,
      sessionConfig,
      options,
    )
  }

  _isCopilotConfigChanged(nextValue = {}, prevValue = {}) {
    const IGNORED_KEYS = ['prompts']

    const normalizedNext = omit(nextValue, IGNORED_KEYS)
    const normalizedPrev = omit(prevValue, IGNORED_KEYS)

    return !isEqual(normalizedNext, normalizedPrev)
  }

  /**
   * Build session configuration
   * @private
   * @param {ExecuteOptions} options - Execution options
   * @returns {Object} Session configuration
   */
  _buildSessionConfig(options) {
    const config = appStore.get('copilot') || {}

    return {
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      model: config.model,
      maxSteps: options.maxSteps || config.maxSteps,
      lang: config.lang,
      quiet: options.quiet || config.quiet,
    }
  }

  // ==================== Task Control ====================

  /**
   * Stop the current task on a device
   *
   * @param {string} deviceId - Device ID
   * @param {string} [reason] - Abort reason (default: 'User termination')
   */
  stop(deviceId, reason = 'User termination') {
    this.sessionManager.stopTask(deviceId, reason)
  }

  /**
   * Destroy the session of a device
   *
   * @param {string} deviceId - Device ID
   */
  destroy(deviceId) {
    this.sessionManager.destroySession(deviceId)
  }

  /**
   * Destroy all sessions
   */
  destroyAll() {
    this.sessionManager.destroyAll()
  }

  // ==================== Session Queries ====================

  /**
   * Get session information by device
   *
   * @param {string} deviceId - Device ID
   * @returns {SessionInfo|null} Session information
   */
  getSessionByDevice(deviceId) {
    const session = this.sessionManager.getSessionByDevice(deviceId)
    if (!session) {
      return null
    }

    return this._formatSessionInfo(session)
  }

  /**
   * Get all active sessions
   *
   * @returns {Array<SessionInfo>} Session list
   */
  getActiveSessions() {
    return this.sessionManager.getActiveSessions()
  }

  /**
   * Format session information
   * @private
   * @param {Object} session - Session instance
   * @returns {SessionInfo} Formatted session information
   */
  _formatSessionInfo(session) {
    return {
      id: session.id,
      deviceId: session.deviceId,
      isRunning: session.metadata.isRunning,
      currentTask: session.metadata.currentTask,
      createdAt: session.metadata.createdAt,
      lastActiveAt: session.metadata.lastActiveAt,
    }
  }

  // ==================== Advanced Configuration ====================

  /**
   * Set idle timeout
   *
   * @param {number} timeout - Timeout in milliseconds
   */
  setIdleTimeout(timeout) {
    this.sessionManager.setIdleTimeout(timeout)
  }
}

// ==================== Singleton Export ====================

/**
 * Export the CopilotService singleton
 */
const copilotService = new CopilotService()

export default copilotService
