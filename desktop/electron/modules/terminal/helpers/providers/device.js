import { spawnShell } from '$electron/helpers/shell/index.js'
import { getAdbPath } from '$electron/configs/index.js'
import { BaseTerminalProvider } from './base.js'

/**
 * Device Terminal Provider
 * 使用 ADB Shell 实现 Android 设备终端能力
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
   * 启动 ADB Shell
   * @param {Object} options
   * @param {string} options.deviceId - 设备 ID
   * @param {string} [options.encoding] - 编码
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
   * 写入数据到 ADB stdin
   */
  write(data) {
    if (!this.controller || !this.isAlive) {
      console.warn('[DeviceTerminal] Cannot write: process not alive')
      return
    }

    this.controller.send(data)
  }

  /**
   * 调整终端大小（ADB 不支持动态调整）
   * @note ADB shell 不支持 SIGWINCH，此方法为占位实现
   */
  resize(cols, rows) {
    console.warn('[DeviceTerminal] ADB shell does not support dynamic resize')
    // ADB shell 无法调整大小，保留接口以符合抽象
  }

  /**
   * 销毁 ADB Shell
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
