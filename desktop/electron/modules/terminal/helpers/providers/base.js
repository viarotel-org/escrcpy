/**
 * Base Terminal Provider
 */
export class BaseTerminalProvider {
  /**
   * @param {Object} config - Terminal configuration
   * @param {string} config.instanceId - Instance ID
   * @param {Object} config.callbacks - Callback functions
   * @param {Function} config.callbacks.onData - Data output callback
   * @param {Function} config.callbacks.onExit - Exit callback
   * @param {Function} config.callbacks.onError - Error callback
   */
  constructor(config) {
    this.instanceId = config.instanceId
    this.callbacks = config.callbacks || {}
    this.process = null
    this.isAlive = false
  }

  /**
   * Launch the terminal process
   * @param {Object} options - Launch options (defined by subclasses)
   * @returns {Promise<void>}
   */
  async spawn(options) {
    throw new Error('spawn() must be implemented by subclass')
  }

  /**
   * Write data to the terminal's stdin
   * @param {string|Buffer} data - Data to write
   * @returns {void}
   */
  write(data) {
    throw new Error('write() must be implemented by subclass')
  }

  /**
   * Resize the terminal (send SIGWINCH)
   * @param {number} cols - Number of columns
   * @param {number} rows - Number of rows
   * @returns {void}
   */
  resize(cols, rows) {
    throw new Error('resize() must be implemented by subclass')
  }

  /**
   * Destroy the terminal process and release resources
   * @returns {Promise<void>}
   */
  async destroy() {
    throw new Error('destroy() must be implemented by subclass')
  }

  /**
   * Trigger data callback
   * @protected
   */
  _emitData(data) {
    if (this.callbacks.onData) {
      this.callbacks.onData(data)
    }
  }

  /**
   * Trigger exit callback
   * @protected
   */
  _emitExit(code, signal) {
    this.isAlive = false
    if (this.callbacks.onExit) {
      this.callbacks.onExit(code, signal)
    }
  }

  /**
   * Trigger error callback
   * @protected
   */
  _emitError(error) {
    if (this.callbacks.onError) {
      this.callbacks.onError(error)
    }
  }
}
