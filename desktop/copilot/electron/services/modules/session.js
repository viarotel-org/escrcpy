/**
 * Copilot Session Manager
 * Responsible for managing the lifecycle of Copilot sessions across all devices,
 * including core capabilities like creation, execution, destruction, and idle recycling.
 * @module SessionManager
 */
import electronStore from '$electron/helpers/store/index.js'
import pLimit from 'p-limit'
import { randomUUID } from 'node:crypto'
import EventEmitter from 'node:events'
import { AutoGLM } from 'autoglm.js'
import { adbKeyboardApkPath } from '$electron/configs/index.js'
import { sleep } from '$/utils'

// ==================== Constant Definitions (Grouped by Function) ====================

/** Time constants (in milliseconds) */
const TIME_CONSTANTS = {
  DEFAULT_IDLE_TIMEOUT: 30 * 60 * 1000, // Default idle timeout (30 minutes)
  IDLE_CHECK_INTERVAL: 5 * 60 * 1000, // Idle check interval (5 minutes)
  POST_TASK_WAIT_TIME: 1 * 1000, // Wait time after task completion (ensures event handling finishes)
}

/** Log configuration */
const LOG_CONFIG = {
  PREFIX: '[SessionManager]',
}

/** AutoGLM event types (for event forwarding) */
const AGENT_EVENT_TYPES = [
  'start', 'thinking_stream', 'thinking', 'action', 'task_complete', 'error', 'aborted',
]

// ==================== Error Code Definitions (Semantic & Extensible) ====================

/** Business error code enumeration */
const ERROR_CODES = {
  API_NOT_PURCHASED: 'API_NOT_PURCHASED', // API not purchased
  NETWORK_ERROR: 'NETWORK_ERROR', // Network exception
  UNKNOWN_ERROR: 'UNKNOWN_ERROR', // Unknown error
}

// ==================== Type Definitions (Centralized & Semantically Enhanced) ====================

/**
 * Session configuration options
 * @typedef {Object} SessionConfig
 * @property {string} baseUrl - API base address
 * @property {string} apiKey - API authorization key
 * @property {string} model - Model name
 * @property {number} [maxSteps] - Maximum number of execution steps
 * @property {string} [lang] - Execution language
 * @property {boolean} [quiet] - Whether to enable quiet mode
 */

/**
 * Session metadata (stores session state information)
 * @typedef {Object} SessionMetadata
 * @property {string} type - Session type (fixed as 'copilot')
 * @property {number} createdAt - Session creation timestamp
 * @property {number} lastActiveAt - Session last active timestamp
 * @property {string|null} currentTask - Current task description
 * @property {boolean} isRunning - Whether the session is in running state
 */

/**
 * Session instance (core data structure)
 * @typedef {Object} SessionInstance
 * @property {string} id - Unique session identifier
 * @property {string} deviceId - Associated device ID
 * @property {AutoGLM} agent - AutoGLM agent instance
 * @property {EventEmitter} emitter - Event emitter (for forwarding agent events)
 * @property {SessionMetadata} metadata - Session metadata
 * @property {number} stepCounter - Task execution step counter
 */

/**
 * Batch task execution options
 * @typedef {Object} BatchTaskOptions
 * @property {number} [concurrency] - Number of concurrent executions
 * @property {Function} [onSession] - Session creation callback
 * @property {Function} [onData] - Data callback (receives agent events)
 * @property {Function} [onExit] - Task exit callback
 */

/**
 * Session snapshot (simplified session information exposed externally)
 * @typedef {Object} SessionSnapshot
 * @property {string} id - Session ID
 * @property {string} sessionId - Session ID (compatible with legacy field)
 * @property {string} deviceId - Device ID
 * @property {string|null} task - Current task description
 */

// ==================== Core Session Manager Class ====================

/**
 * Session Manager
 * Core capabilities:
 * 1. Session lifecycle management (creation/reuse/destruction/idle recycling)
 * 2. Task execution (single device/batch devices)
 * 3. Session state maintenance (running/idle/timeout)
 * 4. Event forwarding and callback management
 */
export class SessionManager {
  /**
   * Initialize Session Manager
   * @param {Object} [options] - Initialization options
   * @param {number} [options.idleTimeout] - Idle timeout in milliseconds (default: 30 minutes)
   */
  constructor(options = {}) {
    /** @type {Map<string, SessionInstance>} Device ID -> Session instance (primary index) */
    this.deviceSessionMap = new Map()

    /** @type {Map<string, SessionInstance>} Session ID -> Session instance (secondary index) */
    this.sessionIdMap = new Map()

    /** @type {Set<string>} Set of device IDs with running tasks (for quick query) */
    this.runningDeviceSet = new Set()

    /** @type {number} Idle timeout in milliseconds */
    this.idleTimeout = options.idleTimeout || TIME_CONSTANTS.DEFAULT_IDLE_TIMEOUT

    /** @type {NodeJS.Timeout|null} Idle check timer */
    this.idleCheckTimer = null

    // Start automatic idle session recycling mechanism
    this._startIdleCheck()
  }

  // ==================== Session Lifecycle Management (Core Capability) ====================

  /**
   * Get or create a session instance for a device (core entry point)
   * @param {string} deviceId - Unique device identifier
   * @param {SessionConfig} config - Session configuration
   * @returns {SessionInstance} Session instance
   * @throws {Error} Throws error if input parameters are invalid
   */
  getOrCreateSession(deviceId, config) {
    // Defensive programming: input validation
    if (!deviceId || typeof deviceId !== 'string') {
      throw new Error(`${LOG_CONFIG.PREFIX} Device ID must be a non-empty string`)
    }
    if (!config || typeof config !== 'object') {
      throw new Error(`${LOG_CONFIG.PREFIX} Session config must be a valid object`)
    }

    // Reuse existing session: update last active time
    if (this.deviceSessionMap.has(deviceId)) {
      const session = this.deviceSessionMap.get(deviceId)
      session.metadata.lastActiveAt = Date.now()
      return session
    }

    // Create new session
    return this._createNewSession(deviceId, config)
  }

  /**
   * Create a new session instance (private method)
   * @private
   * @param {string} deviceId - Device ID
   * @param {SessionConfig} config - Session configuration
   * @returns {SessionInstance} New session instance
   */
  _createNewSession(deviceId, config) {
    const sessionId = randomUUID()
    const now = Date.now()

    // Create AutoGLM agent instance (core dependency)
    const agent = new AutoGLM({
      maxSteps: config.maxSteps,
      lang: config.lang,
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      model: config.model,
      deviceId,
      adbKeyboardApkPath,
    })

    // Construct complete session instance
    /** @type {SessionInstance} */
    const session = {
      id: sessionId,
      deviceId,
      agent,
      emitter: new EventEmitter(),
      metadata: {
        type: 'copilot',
        createdAt: now,
        lastActiveAt: now,
        currentTask: null,
        isRunning: false,
      },
      stepCounter: 0,
    }

    // Bind agent event handlers (forward events to session emitter)
    this._attachAgentEventHandlers(session)

    // Update indexes
    this.deviceSessionMap.set(deviceId, session)
    this.sessionIdMap.set(sessionId, session)

    console.log(`${LOG_CONFIG.PREFIX} Created new session: ${sessionId} (Device: ${deviceId})`)
    return session
  }

  /**
   * Destroy the session for a specific device
   * @param {string} deviceId - Device ID
   */
  destroySession(deviceId) {
    const session = this.deviceSessionMap.get(deviceId)
    if (!session) {
      console.warn(`${LOG_CONFIG.PREFIX} No valid session found for device ${deviceId}, no need to destroy`)
      return
    }

    try {
      // Stop running task if exists
      if (session.metadata.isRunning) {
        this.stopTask(deviceId, 'Session destruction')
      }

      // Clean up session resources (indexes/events/state)
      this._cleanupSessionResources(session)

      console.log(`${LOG_CONFIG.PREFIX} Destroyed session: ${session.id} (Device: ${deviceId})`)
    }
    catch (error) {
      console.error(`${LOG_CONFIG.PREFIX} Failed to destroy session for device ${deviceId}:`, error.message)
    }
  }

  /**
   * Destroy all sessions and clean up resources
   */
  destroyAll() {
    const sessionCount = this.deviceSessionMap.size
    console.log(`${LOG_CONFIG.PREFIX} Starting to destroy all sessions (total: ${sessionCount})`)

    try {
      // Batch stop tasks + clean up event listeners
      Array.from(this.deviceSessionMap.values()).forEach((session) => {
        if (session.metadata?.isRunning) {
          this.stopTask(session.deviceId, 'Batch session destruction')
        }
        session.emitter?.removeAllListeners?.()
      })

      // Clear all indexes
      this.deviceSessionMap.clear()
      this.sessionIdMap.clear()
      this.runningDeviceSet.clear()

      // Stop idle check timer
      this._stopIdleCheck()

      console.log(`${LOG_CONFIG.PREFIX} All sessions destroyed successfully`)
    }
    catch (error) {
      console.error(`${LOG_CONFIG.PREFIX} Failed to batch destroy sessions:`, error.message)
    }
  }

  /**
   * Clean up session resources (private method)
   * @private
   * @param {SessionInstance} session - Session instance
   */
  _cleanupSessionResources(session) {
    // Remove all event listeners (prevent memory leaks)
    session.emitter.removeAllListeners()

    // Remove from indexes
    this.deviceSessionMap.delete(session.deviceId)
    this.sessionIdMap.delete(session.id)
    this.runningDeviceSet.delete(session.deviceId)
  }

  // ==================== Task Execution Management ====================

  /**
   * Execute a task on a single device
   * @param {string} deviceId - Device ID
   * @param {string} task - Task description
   * @param {SessionConfig} config - Session configuration
   * @param {Object} [callbacks] - Callback function collection
   * @param {Function} [callbacks.onData] - Data callback (receives agent events)
   * @param {Function} [callbacks.onExit] - Task exit callback
   * @returns {Promise<{session: SessionInstance, promise: Promise, cleanup: Function}>} Execution result
   */
  async executeTask(deviceId, task, config, callbacks = {}) {
    // Input validation (defensive programming)
    if (!task || typeof task !== 'string') {
      throw new Error(`${LOG_CONFIG.PREFIX} Task description must be a non-empty string`)
    }

    const session = this.getOrCreateSession(deviceId, config)
    // Bind callback functions and return cleanup method
    const cleanup = this._bindSessionCallbacks(session, callbacks)

    try {
      // Update session running state
      this._updateSessionRunningState(session, task, true)
      // Execute agent task
      const taskPromise = session.agent.run(task, { quiet: config.quiet || false })

      return {
        session,
        promise: taskPromise,
        cleanup,
      }
    }
    catch (error) {
      console.error(`${LOG_CONFIG.PREFIX} Failed to execute task on device ${deviceId}:`, error.message)
      cleanup() // Execute cleanup
      throw error // Re-throw error for upper-layer handling
    }
  }

  /**
   * Execute tasks on multiple devices in batch
   * @param {string} task - Task description
   * @param {string[]} deviceIds - List of device IDs
   * @param {SessionConfig} sessionConfig - Session configuration
   * @param {BatchTaskOptions} [options] - Execution options
   * @returns {Promise<[SessionSnapshot[], Object[]]>} [Success list, Failure list]
   */
  async executeTaskList(task, deviceIds, sessionConfig, options = {}) {
    // Input validation
    if (!Array.isArray(deviceIds) || deviceIds.length === 0) {
      throw new Error(`${LOG_CONFIG.PREFIX} Device ID list must be a non-empty array`)
    }

    // Get concurrency limit (priority: custom > config > default 5)
    const concurrencyLimit = this._getConcurrencyLimit(options.concurrency)
    const limit = pLimit(concurrencyLimit)

    const sessionSnapshots = []
    const cleanupFunctions = []

    // Create task executor wrapper for single device
    const createDeviceTaskExecutor = deviceId => limit(async () => {
      return this._executeSingleDeviceTask({
        deviceId,
        task,
        sessionConfig,
        sessionSnapshots,
        cleanupFunctions,
        options,
      })
    })

    // Build task list for all devices
    const deviceTasks = deviceIds.map(createDeviceTaskExecutor)

    // Trigger session creation callback
    options.onSession?.(sessionSnapshots)

    try {
      // Execute all tasks and categorize results
      const taskResults = await Promise.all(deviceTasks)
      return this._categorizeTaskResults(taskResults)
    }
    finally {
      // Execute cleanup regardless of success or failure
      this._executeCleanupFunctions(cleanupFunctions)
    }
  }

  /**
   * Execute task on a single device (internal method for batch execution)
   * @private
   * @param {Object} params - Input parameter object (improves parameter readability)
   * @param {string} params.deviceId - Device ID
   * @param {string} params.task - Task description
   * @param {SessionConfig} params.sessionConfig - Session configuration
   * @param {SessionSnapshot[]} params.sessionSnapshots - List of session snapshots
   * @param {Function[]} params.cleanupFunctions - List of cleanup functions
   * @param {BatchTaskOptions} params.options - Execution options
   * @returns {Object} Task execution result
   */
  async _executeSingleDeviceTask({
    deviceId,
    task,
    sessionConfig,
    sessionSnapshots,
    cleanupFunctions,
    options,
  }) {
    let sessionSnapshot = null
    let sessionEmitter = null
    let exitCode = 0
    let errorInfo = null

    try {
      // Execute single task
      const executeResult = await this.executeTask(
        deviceId,
        task,
        sessionConfig,
        options,
      )

      // Create session snapshot (hides internal details)
      sessionSnapshot = this._createSessionSnapshot(executeResult.session)
      sessionEmitter = executeResult.session.emitter

      // Collect snapshot and cleanup function
      sessionSnapshots.push(sessionSnapshot)
      cleanupFunctions.push(executeResult.cleanup)

      // Wait for task completion
      await executeResult.promise
    }
    catch (err) {
      exitCode = 1
      // Normalize error information
      errorInfo = this._normalizeTaskError(err)
    }
    finally {
      // Trigger exit event
      if (sessionEmitter) {
        sessionEmitter.emit('exit', { session: sessionSnapshot, exitCode })
      }
      // Wait for event handling to complete
      await sleep(TIME_CONSTANTS.POST_TASK_WAIT_TIME)
    }

    // Return normalized result
    return exitCode === 0
      ? { status: 'fulfilled', session: sessionSnapshot }
      : { status: 'rejected', session: sessionSnapshot, error: errorInfo }
  }

  /**
   * Stop the current task on a specific device
   * @param {string} deviceId - Device ID
   * @param {string} [reason] - Abort reason
   */
  stopTask(deviceId, reason = 'User abort') {
    const session = this.deviceSessionMap.get(deviceId)
    if (!session) {
      console.warn(`${LOG_CONFIG.PREFIX} No session found for device ${deviceId}, cannot stop task`)
      return
    }

    try {
      if (typeof session.agent.abort === 'function') {
        session.agent.abort(reason)
        console.log(`${LOG_CONFIG.PREFIX} Stopped task on device ${deviceId}: ${reason}`)
        // Clean up session running state
        this.clearRunningState(session)
      }
      else {
        console.warn(`${LOG_CONFIG.PREFIX} Agent for device ${deviceId} does not support abort operation`)
      }
    }
    catch (error) {
      console.error(`${LOG_CONFIG.PREFIX} Failed to stop task on device ${deviceId}:`, error.message)
    }
  }

  // ==================== Idle Session Management ====================

  /**
   * Start idle session check timer
   * @private
   */
  _startIdleCheck() {
    if (this.idleCheckTimer) {
      this._stopIdleCheck() // Prevent duplicate startup
    }

    this.idleCheckTimer = setInterval(() => {
      this._checkAndRecycleIdleSessions()
    }, TIME_CONSTANTS.IDLE_CHECK_INTERVAL)

    console.log(
      `${LOG_CONFIG.PREFIX} Idle session check started (check interval: ${TIME_CONSTANTS.IDLE_CHECK_INTERVAL / 1000}s, timeout: ${this.idleTimeout / 1000}s)`,
    )
  }

  /**
   * Stop idle session check timer
   * @private
   */
  _stopIdleCheck() {
    if (this.idleCheckTimer) {
      clearInterval(this.idleCheckTimer)
      this.idleCheckTimer = null
      console.log(`${LOG_CONFIG.PREFIX} Idle session check stopped`)
    }
  }

  /**
   * Check and recycle idle sessions
   * @private
   */
  _checkAndRecycleIdleSessions() {
    const now = Date.now()
    const idleDeviceIds = []

    // Traverse all sessions and filter timed-out idle sessions (avoid modifying Map during traversal)
    for (const [deviceId, session] of this.deviceSessionMap.entries()) {
      // Skip running sessions
      if (session.metadata.isRunning)
        continue

      const idleDuration = now - session.metadata.lastActiveAt
      if (idleDuration > this.idleTimeout) {
        console.log(
          `${LOG_CONFIG.PREFIX} Session ${session.id} (Device ${deviceId}) idle timed out (idle for ${Math.floor(idleDuration / 1000)}s)`,
        )
        idleDeviceIds.push(deviceId)
      }
    }

    // Batch destroy idle sessions
    idleDeviceIds.forEach(deviceId => this.destroySession(deviceId))

    if (idleDeviceIds.length > 0) {
      console.log(`${LOG_CONFIG.PREFIX} Recycled ${idleDeviceIds.length} idle sessions`)
    }
  }

  /**
   * Set idle timeout
   * @param {number} timeout - Timeout in milliseconds
   */
  setIdleTimeout(timeout) {
    if (typeof timeout !== 'number' || timeout <= 0) {
      console.warn(`${LOG_CONFIG.PREFIX} Invalid idle timeout: ${timeout} (must be a positive integer)`)
      return
    }

    this.idleTimeout = timeout
    console.log(`${LOG_CONFIG.PREFIX} Idle timeout updated to: ${timeout / 1000}s`)
  }

  // ==================== Session Query & State Management ====================

  /**
   * Get session instance by session ID
   * @param {string} sessionId - Session ID
   * @returns {SessionInstance|null} Session instance (null if not exists)
   */
  getSessionById(sessionId) {
    return this.sessionIdMap.get(sessionId) || null
  }

  /**
   * Get session instance by device ID
   * @param {string} deviceId - Device ID
   * @returns {SessionInstance|null} Session instance (null if not exists)
   */
  getSessionByDevice(deviceId) {
    return this.deviceSessionMap.get(deviceId) || null
  }

  /**
   * Get summary information of all active sessions
   * @returns {Array<Object>} List of session summaries
   */
  getActiveSessions() {
    return Array.from(this.deviceSessionMap.values()).map(session => ({
      id: session.id,
      deviceId: session.deviceId,
      isRunning: session.metadata.isRunning,
      currentTask: session.metadata.currentTask,
      createdAt: session.metadata.createdAt,
      lastActiveAt: session.metadata.lastActiveAt,
    }))
  }

  /**
   * Clear session running state
   * @param {SessionInstance} session - Session instance
   */
  clearRunningState(session) {
    session.stepCounter = 0
    session.metadata.isRunning = false
    session.metadata.currentTask = null
    session.metadata.lastActiveAt = Date.now()
    this.runningDeviceSet.delete(session.deviceId)
  }

  /**
   * Update session running state
   * @private
   * @param {SessionInstance} session - Session instance
   * @param {string|null} task - Task description
   * @param {boolean} isRunning - Whether the session is running
   */
  _updateSessionRunningState(session, task, isRunning) {
    session.metadata.currentTask = task
    session.metadata.isRunning = isRunning
    session.metadata.lastActiveAt = Date.now()

    if (isRunning) {
      this.runningDeviceSet.add(session.deviceId)
    }
    else {
      this.runningDeviceSet.delete(session.deviceId)
    }
  }

  // ==================== Helper Methods (Semantic & Single Responsibility) ====================

  /**
   * Get concurrency limit
   * @private
   * @param {number} [customLimit] - Custom concurrency limit
   * @returns {number} Final concurrency limit
   */
  _getConcurrencyLimit(customLimit) {
    if (customLimit && typeof customLimit === 'number' && customLimit > 0) {
      return customLimit
    }
    // Get from config, default to 5
    return electronStore.get('common.concurrencyLimit') ?? 5
  }

  /**
   * Create session snapshot (hides internal details, exposes simplified information externally)
   * @private
   * @param {SessionInstance} session - Session instance
   * @returns {SessionSnapshot} Session snapshot
   */
  _createSessionSnapshot(session) {
    return {
      id: session.id,
      sessionId: session.id, // Compatible with legacy field
      deviceId: session.deviceId,
      task: session.metadata.currentTask,
    }
  }

  /**
   * Bind session callback functions
   * @private
   * @param {SessionInstance} session - Session instance
   * @param {Object} callbacks - Collection of callback functions
   * @returns {Function} Cleanup function (unbinds callbacks)
   */
  _bindSessionCallbacks(session, callbacks = {}) {
    const eventHandlerTeardowns = []
    let isCleanedUp = false // Prevent duplicate cleanup

    // Cleanup function: unbind all event listeners
    const cleanup = () => {
      if (isCleanedUp)
        return
      isCleanedUp = true
      eventHandlerTeardowns.forEach(teardown => teardown?.())
    }

    const sessionSnapshot = this._createSessionSnapshot(session)

    // Bind data callback
    if (typeof callbacks.onData === 'function') {
      const dataHandler = payload => callbacks.onData(payload, sessionSnapshot)
      session.emitter.on('data', dataHandler)
      eventHandlerTeardowns.push(() => session.emitter.off('data', dataHandler))
    }

    // Bind exit callback
    if (typeof callbacks.onExit === 'function') {
      const exitHandler = ({ exitCode, signal }) => {
        callbacks.onExit({ exitCode, signal, session: sessionSnapshot })
      }
      session.emitter.on('exit', exitHandler)
      eventHandlerTeardowns.push(() => session.emitter.off('exit', exitHandler))
    }

    return cleanup
  }

  /**
   * Bind AutoGLM agent event handlers (forwards events to session emitter)
   * @private
   * @param {SessionInstance} session - Session instance
   */
  _attachAgentEventHandlers(session) {
    const { agent, emitter, id, deviceId } = session

    // Event forwarder: uniformly handle agent events
    const forwardAgentEvent = (event, payload) => {
      // Skip redundant finish actions
      if (['action'].includes(event) && ['finish'].includes(payload?.message?._metadata)) {
        return false
      }

      session.stepCounter++

      emitter.emit('data', {
        event,
        payload,
        context: {
          stepNumber: session.stepCounter,
          sessionId: id,
          deviceId,
        },
      })
    }

    // Batch bind events (extensible)
    AGENT_EVENT_TYPES.forEach((event) => {
      agent.on(event, payload => forwardAgentEvent(event, payload))
    })
  }

  /**
   * Normalize task execution errors
   * @private
   * @param {Error} error - Original error object
   * @returns {Object} Normalized error information
   */
  _normalizeTaskError(error) {
    // API not purchased error
    if (error?.status === 400 && error?.error?.message) {
      return {
        code: ERROR_CODES.API_NOT_PURCHASED,
        message: error.error.message,
        retryable: false,
        raw: error,
      }
    }

    // Network error (timeout/abort)
    if (error?.code === 'ETIMEDOUT' || error?.name === 'AbortError') {
      return {
        code: ERROR_CODES.NETWORK_ERROR,
        message: 'Network exception, please try again later',
        retryable: true,
        raw: error,
      }
    }

    // Unknown error
    return {
      code: ERROR_CODES.UNKNOWN_ERROR,
      message: error?.message || 'Unknown error',
      retryable: false,
      raw: error,
    }
  }

  /**
   * Categorize task execution results (success/failure)
   * @private
   * @param {Array} results - List of task execution results
   * @returns {[SessionSnapshot[], Object[]]} [Success list, Failure list]
   */
  _categorizeTaskResults(results) {
    const successList = []
    const failureList = []

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        successList.push(result.session)
      }
      else {
        failureList.push({
          ...result.session,
          ...result.error,
        })
      }
    })

    if (failureList.length > 0) {
      console.warn(`${LOG_CONFIG.PREFIX} Batch task execution failed count: ${failureList.length}`, failureList)
    }

    return [successList, failureList]
  }

  /**
   * Execute list of cleanup functions (fault-tolerant handling)
   * @private
   * @param {Function[]} cleanupFunctions - List of cleanup functions
   */
  _executeCleanupFunctions(cleanupFunctions) {
    cleanupFunctions.forEach((cleanup) => {
      try {
        cleanup()
      }
      catch (e) {
        console.warn(`${LOG_CONFIG.PREFIX} Failed to execute cleanup function:`, e.message)
      }
    })
  }
}

// ==================== Singleton Export (Preserves Original Semantics) ====================

/**
 * Session Manager singleton (default config: 30-minute idle timeout)
 */
export const sessionManager = new SessionManager({
  idleTimeout: TIME_CONSTANTS.DEFAULT_IDLE_TIMEOUT,
})
