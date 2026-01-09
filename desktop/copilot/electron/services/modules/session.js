/**
 * Copilot Session Manager
 *
 * @module SessionManager
 */
import appStore from '$electron/helpers/store.js'
import pLimit from 'p-limit'
import { randomUUID } from 'node:crypto'
import EventEmitter from 'node:events'
import { AutoGLM } from 'autoglm.js'
import { adbKeyboardApkPath } from '$electron/configs/index.js'
import { sleep } from '$/utils'

// ==================== 常量定义 ====================

/** 默认空闲超时时间（30分钟） */
const DEFAULT_IDLE_TIMEOUT = 30 * 60 * 1000

/** 空闲检查间隔（5分钟） */
const IDLE_CHECK_INTERVAL = 5 * 60 * 1000

/** 任务完成后的等待时间（确保所有事件处理完成） */
const POST_TASK_WAIT_TIME = 1 * 1000

/** 日志前缀 */
const LOG_PREFIX = '[SessionManager]'

// ==================== 错误码定义 ====================

/** 错误类型常量 */
const ERROR_CODES = {
  API_NOT_PURCHASED: 'API_NOT_PURCHASED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
}

// ==================== 会话管理器 ====================

/**
 * 会话配置类型定义
 * @typedef {Object} SessionConfig
 * @property {string} baseUrl - API 基础 URL
 * @property {string} apiKey - API 密钥
 * @property {string} model - 模型名称
 * @property {number} [maxSteps] - 最大执行步数
 * @property {string} [lang] - 语言
 * @property {boolean} [quiet] - 静默模式
 */

/**
 * 会话实例类型定义
 * @typedef {Object} SessionInstance
 * @property {string} id - 会话 ID
 * @property {string} deviceId - 设备 ID
 * @property {AutoGLM} agent - AutoGLM 实例
 * @property {EventEmitter} emitter - 事件发射器
 * @property {Object} metadata - 会话元数据
 * @property {number} stepCounter - 步骤计数器
 */

/**
 * 会话管理器
 * 负责管理所有设备的 Copilot 会话，包括会话创建、执行、生命周期管理等
 */
export class SessionManager {
  /**
   * @param {Object} options - 配置选项
   * @param {number} [options.idleTimeout] - 空闲超时时间（毫秒，默认 30 分钟）
   */
  constructor(options = {}) {
    /** @type {Map<string, SessionInstance>} 设备ID -> 会话实例 */
    this.sessions = new Map()

    /** @type {Map<string, SessionInstance>} 会话ID -> 会话实例 */
    this.sessionById = new Map()

    /** @type {Set<string>} 正在运行的设备ID集合 */
    this.runningTasks = new Set()

    /** @type {number} 空闲超时时间（毫秒） */
    this.idleTimeout = options.idleTimeout || DEFAULT_IDLE_TIMEOUT

    /** @type {NodeJS.Timeout|null} 空闲检查定时器 */
    this.idleCheckTimer = null

    // 启动空闲会话检查
    this._startIdleCheck()
  }

  /**
   * 获取或创建设备的会话实例
   *
   * @param {string} deviceId - 设备 ID
   * @param {SessionConfig} config - 会话配置
   * @returns {SessionInstance} 会话实例
   */
  getOrCreateSession(deviceId, config) {
    // 复用已有会话
    if (this.sessions.has(deviceId)) {
      const session = this.sessions.get(deviceId)
      session.metadata.lastActiveAt = Date.now()
      return session
    }

    // 创建新会话
    return this._createNewSession(deviceId, config)
  }

  /**
   * 创建新会话
   * @private
   * @param {string} deviceId - 设备 ID
   * @param {SessionConfig} config - 会话配置
   * @returns {SessionInstance} 会话实例
   */
  _createNewSession(deviceId, config) {
    const sessionId = randomUUID()
    const now = Date.now()

    // 创建 AutoGLM 代理实例
    const agent = new AutoGLM({
      maxSteps: config.maxSteps,
      lang: config.lang,
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      model: config.model,
      deviceId,
      adbKeyboardApkPath,
    })

    // 创建会话实例
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

    // 绑定事件处理器
    this._attachEventHandlers(session)

    // 保存到索引
    this.sessions.set(deviceId, session)
    this.sessionById.set(sessionId, session)

    console.log(`${LOG_PREFIX} 创建新会话: ${sessionId} (设备: ${deviceId})`)

    return session
  }

  /**
   * 执行单个设备任务
   *
   * @param {string} deviceId - 设备 ID
   * @param {string} task - 任务描述
   * @param {SessionConfig} config - 会话配置
   * @param {Object} [callbacks] - 回调函数集合（可选）
   * @param {Function} [callbacks.onData] - 数据回调
   * @param {Function} [callbacks.onExit] - 退出回调
   * @returns {Promise<{session: SessionInstance, promise: Promise, cleanup: Function}>} 会话实例、执行 Promise 和清理函数
   */
  async executeTask(deviceId, task, config, callbacks = {}) {
    const session = this.getOrCreateSession(deviceId, config)

    const cleanup = this._wireSessionCallbacks(session, callbacks)

    // 更新会话状态
    this._updateSessionState(session, task, true)

    try {
      // 执行任务
      const promise = session.agent.run(task, { quiet: config.quiet || false })

      return {
        session,
        promise,
        cleanup,
      }
    }
    catch (error) {
      console.error(`${LOG_PREFIX} 任务执行失败 (${deviceId}):`, error.message)
      cleanup()
      throw error
    }
  }

  /**
   * 更新会话状态
   * @private
   * @param {SessionInstance} session - 会话实例
   * @param {string|null} task - 任务描述
   * @param {boolean} isRunning - 是否正在运行
   */
  _updateSessionState(session, task, isRunning) {
    session.metadata.currentTask = task
    session.metadata.isRunning = isRunning
    session.metadata.lastActiveAt = Date.now()

    if (isRunning) {
      this.runningTasks.add(session.deviceId)
    }
    else {
      this.runningTasks.delete(session.deviceId)
    }
  }

  /**
   * 批量执行设备任务
   * @param {string} task - 任务描述
   * @param {string[]} deviceIds - 设备 ID 列表
   * @param {SessionConfig} sessionConfig - 会话配置
   * @param {Object} options - 执行选项
   * @param {number} [options.concurrency] - 并发数
   * @param {Function} [options.onSession] - 会话创建回调
   * @param {Function} [options.onData] - 数据回调
   * @param {Function} [options.onExit] - 退出回调
   * @returns {Promise<[Array, Array]>} [成功列表, 失败列表]
   */
  async executeTaskList(task, deviceIds, sessionConfig, options = {}) {
    const concurrencyLimit = this._getConcurrencyLimit(options.concurrency)
    const limit = pLimit(concurrencyLimit)

    const sessions = []
    const cleanups = []

    // 创建任务包装器
    const taskWrapper = deviceId => limit(async () =>
      this._executeDeviceTask(deviceId, task, sessionConfig, sessions, cleanups, options),
    )

    // 执行所有任务
    const tasks = deviceIds.map(deviceId => taskWrapper(deviceId))

    // 通知会话创建
    options.onSession?.(sessions)

    try {
      const results = await Promise.all(tasks)

      return this._categorizeResults(results)
    }
    finally {
      this._executeCleanups(cleanups)
    }
  }

  /**
   * 获取并发限制
   * @private
   * @param {number} [customLimit] - 自定义并发数
   * @returns {number} 并发限制
   */
  _getConcurrencyLimit(customLimit) {
    return customLimit ?? appStore.get('common.concurrencyLimit') ?? 5
  }

  _getCleanSession(deviceId) {
    const session = this.sessions.get(deviceId)

    return {
      id: session.id,
      sessionId: session.id,
      deviceId: session.deviceId,
      task: session.task,
    }
  }

  /**
   * 执行单个设备任务（用于批量执行）
   * @private
   */
  async _executeDeviceTask(deviceId, task, sessionConfig, sessions, cleanups, options) {
    let session
    let emitter

    try {
      const result = await this.executeTask(deviceId, task, sessionConfig, options)

      session = this._getCleanSession(result.session.deviceId)

      emitter = result.session.emitter

      sessions.push(session)
      cleanups.push(result.cleanup)

      await result.promise

      await sleep(POST_TASK_WAIT_TIME)

      return {
        status: 'fulfilled',
        session,
      }
    }
    catch (err) {
      return {
        status: 'rejected',
        session,
        error: this._normalizeExecuteError(err),
      }
    }
    finally {
      if (emitter) {
        emitter.emit('exit', {
          session,
          exitCode: 1,
          signal: null,
        })
      }
    }
  }

  /**
   * 分类执行结果
   * @private
   * @param {Array} results - 执行结果列表
   * @returns {[Array, Array]} [成功列表, 失败列表]
   */
  _categorizeResults(results) {
    const successSessions = []
    const failedResults = []

    for (const result of results) {
      if (result.status === 'fulfilled') {
        successSessions.push(result.session)
      }
      else {
        failedResults.push({
          ...result.session,
          ...result.error,
        })
      }
    }

    if (failedResults.length > 0) {
      console.warn(`${LOG_PREFIX} 部分设备执行失败:`, failedResults)
    }

    return [successSessions, failedResults]
  }

  /**
   * 执行清理函数
   * @private
   * @param {Function[]} cleanups - 清理函数列表
   */
  _executeCleanups(cleanups) {
    cleanups.forEach((fn) => {
      try {
        fn()
      }
      catch (e) {
        console.warn(`${LOG_PREFIX} cleanup 失败:`, e)
      }
    })
  }

  /**
   * 将回调直接绑定到会话的 emitter（用于 executeTask）
   * @private
   * @param {SessionInstance} session - 会话实例
   * @param {Object} callbacks - 回调函数集合
   * @returns {Function} 清理函数
   */
  _wireSessionCallbacks(session, callbacks = {}) {
    const teardowns = []

    let cleaned = false

    const cleanup = () => {
      if (cleaned)
        return

      cleaned = true
      teardowns.forEach(fn => fn?.())
    }

    const cleanSession = this._getCleanSession(session.deviceId)

    // 绑定数据事件
    if (callbacks.onData) {
      const handler = (payload) => {
        callbacks.onData(payload, cleanSession)
      }
      session.emitter.on('data', handler)
      teardowns.push(() => session.emitter.off('data', handler))
    }

    // 绑定退出事件
    if (callbacks.onExit) {
      const handler = ({ exitCode, signal }) => {
        callbacks.onExit?.({ exitCode, signal, session: cleanSession })
      }
      session.emitter.on('exit', handler)
      teardowns.push(() => session.emitter.off('exit', handler))
    }

    return cleanup
  }

  /**
   * 将底层异常转换为可消费的业务错误
   * @private
   * @param {Error} err - 原始错误
   * @returns {Object} 标准化错误对象
   */
  _normalizeExecuteError(err) {
    // API 未购买错误
    if (err?.status === 400 && err?.error?.message) {
      return {
        code: ERROR_CODES.API_NOT_PURCHASED,
        message: err.error.message,
        retryable: false,
        raw: err,
      }
    }

    // 网络超时错误
    if (err?.code === 'ETIMEDOUT' || err?.name === 'AbortError') {
      return {
        code: ERROR_CODES.NETWORK_ERROR,
        message: '网络异常，请稍后重试',
        retryable: true,
        raw: err,
      }
    }

    // 未知错误
    return {
      code: ERROR_CODES.UNKNOWN_ERROR,
      message: err?.message || '未知错误',
      retryable: false,
      raw: err,
    }
  }

  /**
   * 停止设备的当前任务
   *
   * @param {string} deviceId - 设备 ID
   * @param {string} [reason] - 中止原因（默认：'用户中止'）
   */
  stopTask(deviceId, reason = '用户中止') {
    const session = this.sessions.get(deviceId)

    if (!session) {
      console.warn(`${LOG_PREFIX} 未找到设备 ${deviceId} 的会话`)
      return
    }

    if (typeof session.agent.abort === 'function') {
      session.agent.abort(reason)
      console.log(`${LOG_PREFIX} 已停止设备 ${deviceId} 的任务: ${reason}`)
    }
    else {
      console.warn(`${LOG_PREFIX} 设备 ${deviceId} 的代理不支持 abort 方法`)
    }
  }

  /**
   * 销毁设备的会话
   *
   * @param {string} deviceId - 设备 ID
   */
  destroySession(deviceId) {
    const session = this.sessions.get(deviceId)
    if (!session) {
      return
    }

    // 停止运行中的任务
    if (session.metadata.isRunning) {
      this.stopTask(deviceId, '会话被销毁')
    }

    // 清理会话资源
    this._cleanupSession(session)

    console.log(`${LOG_PREFIX} 已销毁会话: ${session.id} (设备: ${deviceId})`)
  }

  /**
   * 清理会话资源
   * @private
   * @param {SessionInstance} session - 会话实例
   */
  _cleanupSession(session) {
    // 移除所有事件监听器
    session.emitter.removeAllListeners()

    // 从索引中移除
    this.sessions.delete(session.deviceId)
    this.sessionById.delete(session.id)
    this.runningTasks.delete(session.deviceId)
  }

  /**
   * 销毁所有会话
   */
  destroyAll() {
    const sessionCount = this.sessions.size
    console.log(`${LOG_PREFIX} 销毁所有会话 (共 ${sessionCount} 个)`)

    // 停止所有任务并清理
    for (const session of this.sessions.values()) {
      if (session.metadata.isRunning) {
        this.stopTask(session.deviceId, '批量销毁会话')
      }
      session.emitter.removeAllListeners()
    }

    // 清空所有索引
    this.sessions.clear()
    this.sessionById.clear()
    this.runningTasks.clear()

    // 停止空闲检查
    this._stopIdleCheck()
  }

  /**
   * 通过会话 ID 获取会话实例
   *
   * @param {string} sessionId - 会话 ID
   * @returns {SessionInstance|null}
   */
  getSessionById(sessionId) {
    return this.sessionById.get(sessionId) || null
  }

  /**
   * 通过设备 ID 获取会话实例
   *
   * @param {string} deviceId - 设备 ID
   * @returns {SessionInstance|null}
   */
  getSessionByDevice(deviceId) {
    return this.sessions.get(deviceId) || null
  }

  /**
   * 获取所有活跃会话的摘要信息
   *
   * @returns {Array<Object>} 会话摘要列表
   */
  getActiveSessions() {
    return Array.from(this.sessions.values()).map(session => ({
      id: session.id,
      deviceId: session.deviceId,
      isRunning: session.metadata.isRunning,
      currentTask: session.metadata.currentTask,
      createdAt: session.metadata.createdAt,
      lastActiveAt: session.metadata.lastActiveAt,
    }))
  }

  /**
   * 绑定 AutoGLM 事件处理器
   * @private
   * @param {SessionInstance} session - 会话实例
   */
  _attachEventHandlers(session) {
    const { agent, emitter, id } = session

    /**
     * 转发事件到会话 emitter
     * @param {string} event - 事件名称
     * @param {*} payload - 事件载荷
     */
    const forward = (event, payload) => {
      session.stepCounter++

      emitter.emit('data', {
        event,
        payload,
        context: {
          stepNumber: session.stepCounter,
          sessionId: id,
          deviceId: session.deviceId,
        },
      })
    }

    const eventTypes = ['start', 'thinking', 'action', 'task_complete', 'error', 'aborted']

    eventTypes.forEach((event) => {
      agent.on(event, (payload) => {
        forward(event, payload)
      })
    })
  }

  /**
   * 清除会话的运行状态
   * @param {SessionInstance} session - 会话实例
   */
  clearRunningState(session) {
    session.stepCounter = 0
    session.metadata.isRunning = false
    session.metadata.currentTask = null
    session.metadata.lastActiveAt = Date.now()
    this.runningTasks.delete(session.deviceId)
  }

  /**
   * 启动空闲会话检查定时器
   * @private
   */
  _startIdleCheck() {
    this.idleCheckTimer = setInterval(() => {
      this._checkIdleSessions()
    }, IDLE_CHECK_INTERVAL)

    console.log(
      `${LOG_PREFIX} 已启动空闲会话检查 (间隔: ${IDLE_CHECK_INTERVAL / 1000}s, 超时: ${this.idleTimeout / 1000}s)`,
    )
  }

  /**
   * 停止空闲会话检查定时器
   * @private
   */
  _stopIdleCheck() {
    if (this.idleCheckTimer) {
      clearInterval(this.idleCheckTimer)
      this.idleCheckTimer = null
      console.log(`${LOG_PREFIX} 已停止空闲会话检查`)
    }
  }

  /**
   * 检查并回收空闲会话
   * @private
   */
  _checkIdleSessions() {
    const now = Date.now()
    const devicesToDestroy = []

    for (const [deviceId, session] of this.sessions.entries()) {
      // 跳过正在运行的会话
      if (session.metadata.isRunning) {
        continue
      }

      const idleTime = now - session.metadata.lastActiveAt

      if (idleTime > this.idleTimeout) {
        console.log(
          `${LOG_PREFIX} 会话 ${session.id} (设备 ${deviceId}) 空闲超时 (${Math.floor(idleTime / 1000)}s)`,
        )
        devicesToDestroy.push(deviceId)
      }
    }

    // 销毁空闲会话
    devicesToDestroy.forEach(deviceId => this.destroySession(deviceId))

    if (devicesToDestroy.length > 0) {
      console.log(`${LOG_PREFIX} 已回收 ${devicesToDestroy.length} 个空闲会话`)
    }
  }

  /**
   * 设置空闲超时时间
   *
   * @param {number} timeout - 超时时间（毫秒）
   */
  setIdleTimeout(timeout) {
    if (typeof timeout !== 'number' || timeout <= 0) {
      console.warn(`${LOG_PREFIX} 无效的超时时间: ${timeout}`)
      return
    }

    this.idleTimeout = timeout
    console.log(`${LOG_PREFIX} 已更新空闲超时时间: ${timeout / 1000}s`)
  }
}

// ==================== 单例导出 ====================

/**
 * 导出 SessionManager 单例
 * 默认配置：30 分钟空闲超时
 */
export const sessionManager = new SessionManager({
  idleTimeout: DEFAULT_IDLE_TIMEOUT,
})
