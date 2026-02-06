import { spawnShell } from '$electron/helpers/shell/index.js'
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
      this.controller = await spawnShell(
        [adbPath, '-s', deviceId, 'shell', '-tt'],
        {
          shell: false,
          encoding,
          stdout: (text) => {
            this._emitData(text)
          },
          stderr: (text) => {
            this._emitData(text)
          },
          exit: (code, signal) => {
            this._emitExit(code, signal)
          },
          error: (message) => {
            this._emitError({
              message,
              code: 'SPAWN_ERROR',
            })
          },
        },
      )

      this.isAlive = true

      console.log(`[DeviceTerminal] Spawned ADB shell: ${deviceId} (${this.instanceId})`)
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
    // ADB shell cannot resize, interface retained for abstraction compliance
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
