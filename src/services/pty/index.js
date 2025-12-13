/**
 * PTY Client - 渲染进程客户端
 * 提供类型安全且优雅的 PTY 调用接口
 */

// 服务名称前缀（与主进程保持一致）
const SERVICE_PREFIX = 'pty'

/**
 * 创建 IPC 通道名称
 */
const createChannel = method => `${SERVICE_PREFIX}:${method}`

/**
 * PTY 客户端类
 */
class PTYClient {
  constructor() {
    this.ipcRenderer = window.electron?.ipcRenderer
    if (!this.ipcRenderer) {
      console.warn('[PTY Client] ipcRenderer not available')
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
   * 创建 PTY 会话
   * @param {Object} options - 会话配置
   * @param {string} [options.shell] - Shell 路径
   * @param {string} [options.cwd] - 工作目录
   * @param {Object} [options.env] - 环境变量
   * @param {number} [options.cols] - 列数
   * @param {number} [options.rows] - 行数
   * @returns {Promise<Object>} 会话信息
   */
  createSession(options = {}) {
    return this._invoke('createSession', options)
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
   * 销毁会话
   * @param {string} sessionId - 会话 ID
   */
  destroy(sessionId) {
    return this._invoke('destroy', sessionId)
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
   * 销毁所有会话
   */
  destroyAll() {
    return this._invoke('destroyAll')
  }

  /**
   * 获取默认 Shell 路径
   * @returns {Promise<string>} Shell 路径
   */
  getDefaultShell() {
    return this._invoke('getDefaultShell')
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

    // 监听数据事件
    const channel = createChannel(`data:${sessionId}`)
    const listener = (_, data) => callback(data)
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
}

// 单例导出
export default new PTYClient()

/**
 * 使用示例：
 *
 * import ptyClient from '@/services/pty'
 *
 * // 创建会话
 * const session = await ptyClient.createSession({ cols: 80, rows: 24 })
 *
 * // 订阅数据
 * const unsubscribeData = await ptyClient.onData(session.id, (data) => {
 *   console.log('Output:', data)
 * })
 *
 * // 写入命令
 * await ptyClient.write(session.id, 'ls -la\n')
 *
 * // 订阅退出
 * const unsubscribeExit = await ptyClient.onExit(session.id, (code, signal) => {
 *   console.log('Exited with code:', code)
 * })
 *
 * // 取消订阅
 * unsubscribeData()
 * unsubscribeExit()
 *
 * // 销毁会话
 * await ptyClient.destroy(session.id)
 */
