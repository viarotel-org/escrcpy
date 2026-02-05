import { spawn } from 'node:child_process'
import treeKill from 'tree-kill'
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
    this.process = null
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
      this.process = spawn(adbPath, ['-s', deviceId, 'shell', '-tt'], {
        shell: false,
        encoding: 'binary',
        env: {
          ...process.env,
        },
      })

      this.isAlive = true

      // 监听标准输出
      this.process.stdout.on('data', (data) => {
        const text = data.toString(encoding)
        this._emitData(text)
      })

      // 监听标准错误（ADB shell 也会输出到 stderr）
      this.process.stderr.on('data', (data) => {
        const text = data.toString(encoding)
        this._emitData(text)
      })

      // 监听退出事件
      this.process.on('exit', (code, signal) => {
        this._emitExit(code, signal)
      })

      // 监听错误事件
      this.process.on('error', (error) => {
        this._emitError({
          message: error.message,
          code: 'SPAWN_ERROR',
        })
      })

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
    if (!this.process || !this.isAlive) {
      console.warn('[DeviceTerminal] Cannot write: process not alive')
      return
    }

    if (!this.process.stdin) {
      console.warn('[DeviceTerminal] stdin not available')
      return
    }

    this.process.stdin.write(data)
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
    if (!this.process) {
      return
    }

    try {
      // 使用 tree-kill 确保子进程也被终止
      await new Promise((resolve, reject) => {
        treeKill(this.process.pid, 'SIGTERM', (err) => {
          if (err) {
            reject(err)
          }
          else {
            resolve()
          }
        })
      })

      this.isAlive = false
      console.log(`[DeviceTerminal] Destroyed: ${this.deviceId} (${this.instanceId})`)
    }
    catch (error) {
      console.error('[DeviceTerminal] Destroy error:', error)
    }
    finally {
      this.process = null
      this.deviceId = null
    }
  }
}
