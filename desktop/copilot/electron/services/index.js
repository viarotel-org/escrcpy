/**
 * Copilot Service
 * Copilot 服务主入口，提供设备任务执行、会话管理等核心功能
 *
 * @module CopilotService
 */
import appStore from '$electron/helpers/store.js'
import { sessionManager } from './modules/index.js'

// ==================== 类型定义 ====================

/**
 * 执行选项
 * @typedef {Object} ExecuteOptions
 * @property {string|string[]} deviceId - 设备 ID 或设备 ID 列表
 * @property {number} [maxSteps] - 最大执行步数
 * @property {boolean} [quiet] - 静默模式
 * @property {number} [concurrency] - 并发数（批量执行时）
 * @property {Function} [onSession] - 会话创建回调
 * @property {Function} [onData] - 数据回调
 * @property {Function} [onExit] - 退出回调
 */

/**
 * 执行结果
 * @typedef {Object} ExecuteResult
 * @property {string} id - 会话 ID
 * @property {string} deviceId - 设备 ID
 * @property {boolean} isRunning - 是否正在运行
 * @property {string} currentTask - 当前任务
 * @property {number} createdAt - 创建时间戳
 * @property {number} lastActiveAt - 最后活跃时间戳
 */

/**
 * 会话信息
 * @typedef {Object} SessionInfo
 * @property {string} id - 会话 ID
 * @property {string} deviceId - 设备 ID
 * @property {boolean} isRunning - 是否正在运行
 * @property {string|null} currentTask - 当前任务
 * @property {number} createdAt - 创建时间戳
 * @property {number} lastActiveAt - 最后活跃时间戳
 */

// ==================== Copilot 服务类 ====================

/**
 * Copilot 服务
 * 提供任务执行、会话管理等核心功能
 */
class CopilotService {
  constructor() {
    /** @type {SessionManager} 会话管理器 */
    this.sessionManager = sessionManager

    if (this.unsubscribeCopilotApiKey) {
      this.unsubscribeCopilotApiKey()
    }

    this.unsubscribeCopilotApiKey = appStore.onDidChange('copilot.apiKey', () => {
      this.sessionManager.destroyAll()
    })
  }

  // ==================== 任务执行 ====================

  /**
   * 执行 Copilot 任务（同时支持单设备和批量设备）
   *
   * @param {string} task - 任务描述
   * @param {ExecuteOptions} options - 执行选项
   * @returns {Promise<ExecuteResult|ExecuteResult[]>} 执行结果
   */
  async execute(task, options = {}) {
    const { deviceId } = options

    // 获取配置
    const sessionConfig = this._buildSessionConfig(options)

    // 标准化设备 ID 列表
    const deviceIds = Array.isArray(deviceId) ? deviceId : [deviceId]

    // 执行任务
    return this.sessionManager.executeTaskList(
      task,
      deviceIds,
      sessionConfig,
      options,
    )
  }

  /**
   * 构建会话配置
   * @private
   * @param {ExecuteOptions} options - 执行选项
   * @returns {Object} 会话配置
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

  // ==================== 任务控制 ====================

  /**
   * 停止设备的当前任务
   *
   * @param {string} deviceId - 设备 ID
   * @param {string} [reason] - 中止原因（默认：'User termination'）
   */
  stop(deviceId, reason = 'User termination') {
    this.sessionManager.stopTask(deviceId, reason)
  }

  /**
   * 销毁设备的会话
   *
   * @param {string} deviceId - 设备 ID
   */
  destroy(deviceId) {
    this.sessionManager.destroySession(deviceId)
  }

  /**
   * 销毁所有会话
   */
  destroyAll() {
    this.sessionManager.destroyAll()
  }

  // ==================== 会话查询 ====================

  /**
   * 获取设备的会话信息
   *
   * @param {string} deviceId - 设备 ID
   * @returns {SessionInfo|null} 会话信息
   */
  getSessionByDevice(deviceId) {
    const session = this.sessionManager.getSessionByDevice(deviceId)
    if (!session) {
      return null
    }

    return this._formatSessionInfo(session)
  }

  /**
   * 获取所有活跃会话
   *
   * @returns {Array<SessionInfo>} 会话列表
   */
  getActiveSessions() {
    return this.sessionManager.getActiveSessions()
  }

  /**
   * 格式化会话信息
   * @private
   * @param {Object} session - 会话实例
   * @returns {SessionInfo} 格式化后的会话信息
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

  // ==================== 高级配置 ====================

  /**
   * 设置空闲超时时间
   *
   * @param {number} timeout - 超时时间（毫秒）
   */
  setIdleTimeout(timeout) {
    this.sessionManager.setIdleTimeout(timeout)
  }
}

// ==================== 单例导出 ====================

/**
 * 导出 CopilotService 单例
 */
const copilotService = new CopilotService()

export default copilotService
