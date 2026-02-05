/**
 * Base Terminal Provider
 * 所有终端类型的抽象基类，定义统一接口
 */
export class BaseTerminalProvider {
  /**
   * @param {Object} config - 终端配置
   * @param {string} config.instanceId - 实例ID
   * @param {Object} config.callbacks - 回调函数
   * @param {Function} config.callbacks.onData - 数据输出回调
   * @param {Function} config.callbacks.onExit - 退出回调
   * @param {Function} config.callbacks.onError - 错误回调
   */
  constructor(config) {
    this.instanceId = config.instanceId
    this.callbacks = config.callbacks || {}
    this.process = null
    this.isAlive = false
  }

  /**
   * 启动终端进程
   * @param {Object} options - 启动选项（由子类定义）
   * @returns {Promise<void>}
   */
  async spawn(options) {
    throw new Error('spawn() must be implemented by subclass')
  }

  /**
   * 写入数据到终端 stdin
   * @param {string|Buffer} data - 要写入的数据
   * @returns {void}
   */
  write(data) {
    throw new Error('write() must be implemented by subclass')
  }

  /**
   * 调整终端大小（发送 SIGWINCH）
   * @param {number} cols - 列数
   * @param {number} rows - 行数
   * @returns {void}
   */
  resize(cols, rows) {
    throw new Error('resize() must be implemented by subclass')
  }

  /**
   * 销毁终端进程并释放资源
   * @returns {Promise<void>}
   */
  async destroy() {
    throw new Error('destroy() must be implemented by subclass')
  }

  /**
   * 触发数据回调
   * @protected
   */
  _emitData(data) {
    if (this.callbacks.onData) {
      this.callbacks.onData(data)
    }
  }

  /**
   * 触发退出回调
   * @protected
   */
  _emitExit(code, signal) {
    this.isAlive = false
    if (this.callbacks.onExit) {
      this.callbacks.onExit(code, signal)
    }
  }

  /**
   * 触发错误回调
   * @protected
   */
  _emitError(error) {
    if (this.callbacks.onError) {
      this.callbacks.onError(error)
    }
  }
}
