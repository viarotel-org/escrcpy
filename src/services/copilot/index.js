/**
 * Copilot Client - 渲染进程客户端
 * 提供类型安全且优雅的 Copilot 调用接口
 */

import { omit } from 'lodash-es'

// 服务名称前缀（与主进程保持一致）
const SERVICE_PREFIX = 'copilot'

/**
 * 创建 IPC 通道名称
 */
const createChannel = method => `${SERVICE_PREFIX}:${method}`

/**
 * 格式化错误信息
 * @param {string} type - 错误类型
 * @param {string} message - 错误消息
 * @returns {{code: string, message: string}}
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
 * @returns {Array<{id: string, name: string}>}
 */
export function parseDeviceList(output) {
  const lines = output.split('\n').filter(line => line.trim())
  return lines.slice(1).map((line) => {
    const id = line.trim()
    return { id, name: id }
  })
}

/**
 * 解析应用列表输出（工具函数，可能在特殊场景使用）
 * @param {string} output - 命令输出
 * @returns {string[]}
 */
export function parseAppList(output) {
  const lines = output.split('\n').filter(line => line.trim())
  return lines.slice(1).map(line => line.trim())
}

/**
 * Copilot 客户端类
 */
class CopilotClient {
  constructor() {
    this.ipcRenderer = window.electron?.ipcRenderer
    if (!this.ipcRenderer) {
      console.warn('[Copilot Client] ipcRenderer not available')
    }
  }

  /**
   * 调用主进程方法
   * @private
   */
  _invoke(method, ...args) {
    if (!this.ipcRenderer) {
      return Promise.reject(new Error('IPC Renderer not available'))
    }

    return this.ipcRenderer.invoke(createChannel(method), ...args)
  }

  /**
   * 执行任务（支持单设备/批量设备）
   * @param {string} task - 任务指令
   * @param {object} options - 选项
   * @param {string|string[]} options.deviceId - 设备ID（批量时传入数组）
   * @param {number} options.maxSteps - 最大步数
   * @param {boolean} options.quiet - 静默模式
   * @param {function} options.onData - 实时输出回调
   * @param {function} options.onError - 错误输出回调
   * @param {function} options.onExit - 退出回调
   * @returns {Promise<{id: string, pid: number}>} 会话信息
   */
  async execute(task, options = {}) {
    // 创建会话
    const session = await this._invoke('createSession', task, omit(options, ['onData', 'onError', 'onExit']))

    // 订阅数据事件
    if (options.onData) {
      await this.onData(session.id, (data) => {
        console.log('execute onData:', data)
        options.onData(data)
      })
    }

    return new Promise((resolve) => {
      this.onExit(session.id, (exitCode, signal) => {
        options.onExit?.(exitCode, signal)

        resolve({
          session,
          exitCode,
          signal,
        })
      })
    })
  }

  /**
   * 停止会话（终止进程）
   * @param {string} sessionId - 会话 ID
   */
  stop(sessionId) {
    if (sessionId) {
      return this._invoke('destroy', sessionId)
    }
    else {
      // 兼容旧 API：停止所有会话
      return this._invoke('destroyAll')
    }
  }

  /**
   * 销毁所有会话
   */
  destroyAll() {
    return this._invoke('destroyAll')
  }

  /**
   * 获取会话信息
   * @param {string} sessionId - 会话 ID
   * @returns {Promise<Object|null>} 会话信息或 null
   */
  getSession(sessionId) {
    return this._invoke('getSession', sessionId)
  }

  /**
   * 列出所有活动会话
   * @returns {Promise<Array>} 会话列表
   */
  listSessions() {
    return this._invoke('listSessions')
  }

  /**
   * 向会话写入数据
   * @param {string} sessionId - 会话 ID
   * @param {string} data - 要写入的数据
   */
  write(sessionId, data) {
    return this._invoke('write', { sessionId, data })
  }

  /**
   * 调整会话终端大小
   * @param {string} sessionId - 会话 ID
   * @param {number} cols - 列数
   * @param {number} rows - 行数
   */
  resize(sessionId, cols, rows) {
    return this._invoke('resize', { sessionId, cols, rows })
  }

  /**
   * 获取 Copilot 配置
   * @returns {Promise<object>}
   */
  getConfig() {
    return this._invoke('getConfig')
  }

  /**
   * 设置 Copilot 配置
   * @param {string|null} key - 配置键（为 null 时替换整个配置）
   * @param {any} value - 配置值
   */
  setConfig(key, value) {
    return this._invoke('setConfig', key, value)
  }

  /**
   * 获取默认配置
   * @returns {Promise<object>}
   */
  getDefaultConfig() {
    return this._invoke('getDefaultConfig')
  }

  /**
   * 订阅数据事件
   * @param {string} sessionId - 会话 ID
   * @param {Function} callback - 数据回调函数
   * @returns {Promise<Function>} 取消订阅函数
   */
  async onData(sessionId, callback) {
    if (!this.ipcRenderer) {
      throw new Error('IPC Renderer not available')
    }

    // 注册主进程订阅
    await this._invoke('onData', sessionId)

    console.log('onData:', sessionId)

    // 监听数据事件
    const channel = createChannel(`data:${sessionId}`)
    const listener = (_, data) => {
      callback(data)
    }
    this.ipcRenderer.on(channel, listener)

    // 返回取消订阅函数
    return () => {
      this.ipcRenderer.removeListener(channel, listener)
      this._invoke('offData', sessionId)
    }
  }

  /**
   * 订阅退出事件
   * @param {string} sessionId - 会话 ID
   * @param {Function} callback - 退出回调函数(exitCode, signal)
   * @returns {Promise<Function>} 取消订阅函数
   */
  async onExit(sessionId, callback) {
    if (!this.ipcRenderer) {
      throw new Error('IPC Renderer not available')
    }

    // 注册主进程订阅
    await this._invoke('onExit', sessionId)

    // 监听退出事件
    const channel = createChannel(`exit:${sessionId}`)
    const listener = (_, { exitCode, signal }) => callback(exitCode, signal)
    this.ipcRenderer.on(channel, listener)

    // 返回取消订阅函数
    return () => {
      this.ipcRenderer.removeListener(channel, listener)
      this._invoke('offExit', sessionId)
    }
  }

  // 工具函数（向外暴露）
  formatError = formatError
  parseDeviceList = parseDeviceList
  parseAppList = parseAppList
}

// 创建并导出单例
const copilotClient = new CopilotClient()

export default copilotClient
