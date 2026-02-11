import { sheller } from '$electron/helpers/shell/index.js'
import { getAdbPath } from '$electron/configs/index.js'
import { BaseTerminalProvider } from './base.js'

/**
 * Device Terminal Provider
 */
export class DeviceTerminalProvider extends BaseTerminalProvider {
  /**
   * @param {Object} config
   * @param {string} config.instanceId
   * @param {Object} config.callbacks
   */
  constructor(config) {
    super(config)
    this.controller = null
    this.deviceId = null
  }

  /**
   * Launch ADB Shell terminal
   * @param {Object} options
   * @param {string} options.deviceId - Device ID
   * @param {string} [options.encoding] - Encoding
   */
  async spawn(options = {}) {
    const { deviceId, encoding = 'utf8' } = options

    if (!deviceId) {
      throw new Error('[DeviceTerminal] deviceId is required')
    }

    this.deviceId = deviceId
    const adbPath = getAdbPath()

    try {
      let isEnded = false

      const adbProcess = sheller(
        [adbPath, '-s', deviceId, 'shell', '-tt'],
        {
          shell: false,
          encoding,
          stdio: ['pipe', 'pipe', 'pipe'],
          stdout: (text) => {
            this._emitData(text)
          },
          stderr: (text) => {
            this._emitData(text)
          },
        },
      )

      adbProcess.on('close', (code, signal) => {
        isEnded = true
        this._emitExit(code, signal)
      })

      adbProcess.on('error', (error) => {
        this._emitError({
          message: error.message,
          code: 'SPAWN_ERROR',
        })
      })

      adbProcess.catch((error) => {
        if (isEnded) {
          return
        }

        this._emitError({
          message: error.message,
          code: 'SPAWN_ERROR',
        })
      })

      this.controller = {
        send: (data) => {
          if (!adbProcess.stdin?.writable)
            return
          adbProcess.stdin.write(data)
        },
        stop: () => {
          adbProcess.kill?.('SIGTERM')
        },
        get isEnded() {
          return isEnded
        },
        get raw() {
          return adbProcess
        },
      }

      this.isAlive = true
    }
    catch (error) {
      this._emitError({
        message: error.message,
        code: 'SPAWN_ERROR',
      })
      throw error
    }
  }

  /**
   * Write data to ADB stdin
   */
  write(data) {
    if (!this.controller || !this.isAlive) {
      console.warn('[DeviceTerminal] Cannot write: process not alive')
      return
    }

    this.controller.send(data)
  }

  /**
   * Resize terminal (ADB does not support dynamic resizing)
   * @note ADB shell does not support SIGWINCH, this method is a placeholder
   */
  resize(cols, rows) {
    console.warn('[DeviceTerminal] ADB shell does not support dynamic resize')
  }

  /**
   * Destroy ADB Shell
   */
  async destroy() {
    if (!this.controller) {
      return
    }

    try {
      if (!this.controller.isEnded) {
        this.controller.stop()
      }

      this.isAlive = false
      console.log(`[DeviceTerminal] Destroyed: ${this.deviceId} (${this.instanceId})`)
    }
    catch (error) {
      console.error('[DeviceTerminal] Destroy error:', error)
    }
    finally {
      this.controller = null
      this.deviceId = null
    }
  }
}
