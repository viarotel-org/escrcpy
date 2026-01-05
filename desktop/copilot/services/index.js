import formatterManager from './formatters/index.js'
import { defaultCopilotConfigs } from '$copilot/configs/index.js'

// 从 preload 暴露的 ipcxRenderer 获取
const { ipcxRenderer } = window.electron

// 服务名称前缀（与主进程保持一致）
const SERVICE_PREFIX = 'copilot'

/**
 * 创建 IPC 通道名称
 * @private
 * @param {string} method - 方法名
 * @returns {string} 完整的 IPC 通道名称
 */
const createChannel = method => `${SERVICE_PREFIX}:${method}`

/**
 * 格式化错误信息
 * @param {string} type - 错误类型
 * @param {string} message - 错误消息
 * @returns {{code: string, message: string}} 错误对象
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
 * 解析设备列表输出（工具函数，可能在特殊场景使用）
 * @param {string} output - 命令输出
 * @returns {Array<{id: string, name: string}>} 设备列表
 */
export function parseDeviceList(output) {
  const lines = output.split('\n').filter(line => line.trim())
  return lines.slice(1).map((line) => {
    const id = line.trim()
    return { id, name: id }
  })
}

/**
 * CopilotClient 类 - 渲染进程 Copilot 服务客户端
 * @class
 */
class CopilotClient {
  constructor() {
    this.formatter = formatterManager.create()
    this.preflightChecker = null // 延迟加载（避免循环依赖）
  }

  /**
   * 调用主进程方法（基于 electron-ipcx）
   * @private
   * @param {string} method - 方法名
   * @param {...any} args - 方法参数
   * @returns {Promise<any>} 执行结果
   */
  _invoke(method, ...args) {
    return ipcxRenderer.invoke(createChannel(method), ...args)
  }

  /**
   * 获取 PreflightChecker 实例（延迟加载）
   * @private
   */
  async _getPreflightChecker() {
    if (!this.preflightChecker) {
      // 动态导入避免循环依赖
      const module = await import('$copilot/utils/PreflightChecker.js')
      this.preflightChecker = module.preflightChecker
    }
    return this.preflightChecker
  }

  /**
   * 执行任务（支持单设备/批量设备，集成前置检查）
   *
   * **核心功能**：
   * - 支持单设备和批量设备执行
   * - 自动执行前置检查（ADB 键盘、API 服务等）
   * - 通过 electron-ipcx 支持函数回调参数（onData、onExit、onSession）
   * - 自动格式化 onData 输出（通过 formatter）
   *
   * @param {string} task - 任务指令（自然语言描述）
   * @param {object} options - 执行选项
   * @param {string|string[]} options.deviceId - 设备ID（单个设备传字符串，批量设备传数组）
   * @param {number} [options.maxSteps] - 最大执行步数
   * @param {boolean} [options.quiet] - 静默模式（减少输出）
   * @param {boolean} [options.skipPreflightCheck] - 跳过前置检查（仅单设备有效，默认 false）
   * @param {function(string, object): void} [options.onData] - 实时输出回调
   *   - 参数1: formatted {string} - 格式化后的输出数据
   *   - 参数2: session {object} - 会话对象
   * @param {function(object, object): void} [options.onExit] - 任务退出回调
   *   - 参数1: result {object} - 退出信息 {exitCode, signal}
   *   - 参数2: session {object} - 会话对象
   * @param {function(object|object[]): void} [options.onSession] - 会话创建回调
   *   - 参数: session {object|object[]} - 单个会话或会话数组
   * @param {function(object): void} [options.onPreflightFail] - 前置检查失败回调
   *   - 参数: checkResult {object} - 检查结果 {passed, failedChecks}
   * @returns {Promise<object|object[]>} 执行结果（单设备返回对象，批量设备返回数组）
   * @throws {Error} 当前置检查失败或执行出错时抛出
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

    // 前置检查（仅单设备执行检查）
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

      // 检查失败，触发回调并阻止执行
      if (!checkResult.passed) {
        console.warn('[CopilotClient] 前置检查失败:', checkResult.failedChecks)

        if (onPreflightFail) {
          onPreflightFail(checkResult)
        }

        // 抛出错误阻止任务执行
        const firstFail = checkResult.failedChecks[0]
        throw new Error(firstFail.message || '前置检查未通过')
      }
    }

    // 包装 onData 以支持 formatter 格式化
    const wrappedOnData = onData
      ? (payload, session) => {
          const formatted = this.formatter.format(
            payload.event,
            payload.payload,
            payload.context,
          )
          onData(formatted, { session, payload })
        }
      : undefined

    return this._invoke('execute', task, {
      deviceId,
      ...restOptions,
      onData: wrappedOnData,
      onExit,
      onSession,
    })
  }

  /**
   * 停止设备的当前任务
   *
   * @param {string} deviceId - 设备 ID
   * @param {string} [reason] - 中止原因（可选，默认 '用户中止'）
   * @returns {Promise<void>}
   */
  stop(deviceId, reason = '用户中止') {
    return this._invoke('stop', deviceId, reason)
  }

  /**
   * 销毁指定设备的会话
   *
   * @param {string} deviceId - 设备 ID
   * @returns {Promise<void>}
   */
  destroy(deviceId) {
    return this._invoke('destroy', deviceId)
  }

  /**
   * 销毁所有会话
   *
   * @returns {Promise<void>}
   */
  destroyAll() {
    return this._invoke('destroyAll')
  }

  /**
   * 获取设备的会话信息
   */
  getSessionByDevice(deviceId) {
    return this._invoke('getSessionByDevice', deviceId)
  }

  /**
   * 获取所有活跃会话
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
   * 检查 ADB 键盘是否已安装
   *
   * @param {string} deviceId - 设备 ID
   * @returns {Promise<boolean>} 是否已安装
   */
  checkKeyboard(deviceId) {
    return this._invoke('checkKeyboard', deviceId)
  }

  /**
   * 安装 ADB 键盘到设备
   *
   * @param {string} deviceId - 设备 ID
   * @returns {Promise<{success: boolean, message: string}>} 安装结果
   */
  installKeyboard(deviceId) {
    return this._invoke('installKeyboard', deviceId)
  }

  /**
   * 检查 API 服务可用性
   *
   * @param {object} config - API 配置
   * @param {string} config.baseUrl - API 基础 URL
   * @param {string} config.apiKey - API 密钥
   * @param {string} config.model - 模型名称
   * @returns {Promise<{success: boolean, message: string}>} 检查结果
   */
  checkModelApi(config) {
    return this._invoke('checkModelApi', config)
  }

  /**
   * 设置空闲超时时间（会话管理器配置）
   *
   * @param {number} timeout - 超时时间（毫秒）
   * @returns {Promise<boolean>} 是否设置成功
   */
  setIdleTimeout(timeout) {
    return this._invoke('setIdleTimeout', timeout)
  }

  /**
   * 获取系统状态（调试用）
   *
   * @returns {Promise<object>} 系统状态
   *   - sessionCount {number} - 活跃会话数
   *   - subscriptionCount {number} - 订阅数
   *   - queuedTasks {number} - 队列中的任务数
   */
  getSystemStats() {
    return this._invoke('getSystemStats')
  }

  // 工具函数（向外暴露）
  formatError = formatError
  parseDeviceList = parseDeviceList
}

// 创建并导出单例
const copilotClient = new CopilotClient()

export default copilotClient
