import { app } from 'electron'
import log from './log.js'

/**
 * 沙盒配置管理器（简化版）
 * 在 Linux 环境下默认禁用 Chromium 沙盒以提高兼容性
 */
class SandboxManager {
  /**
   * 构造函数
   * @param {Object} options - 配置选项
   * @param {Object} options.processModule - 进程模块
   */
  constructor({
    processModule = process,
  } = {}) {
    this.process = processModule
  }

  /**
   * 清理环境变量值
   * @param {string|undefined} value - 环境变量值
   * @returns {string} 清理后的值
   */
  _sanitizeEnvVar(value) {
    if (typeof value !== 'string') {
      return ''
    }
    return value.trim()
  }

  /**
   * 配置沙盒设置（简化版）
   * @returns {Promise<{disabled: boolean, reason: string, checks?: Object}>} 配置结果
   */
  async configureSandbox() {
    const startTime = Date.now()

    // 非 Linux 平台直接返回
    if (this.process.platform !== 'linux') {
      log.debug('Not running on Linux, skipping sandbox configuration')
      return {
        disabled: false,
        reason: 'Not applicable on non-Linux platforms',
        checks: { platform: 'non-linux' },
      }
    }

    let shouldDisable = false
    let reason = ''
    const checkResults = {}

    try {
      // 检查环境变量控制
      const forceEnable = this._sanitizeEnvVar(this.process.env.FORCE_SANDBOX) === '1'
      const forceDisable = this._sanitizeEnvVar(this.process.env.FORCE_NO_SANDBOX) === '1'

      checkResults.forceEnable = forceEnable
      checkResults.forceDisable = forceDisable

      if (forceDisable && forceEnable) {
        log.warn('Both FORCE_NO_SANDBOX and FORCE_SANDBOX are set, prioritizing FORCE_NO_SANDBOX')
      }

      if (forceDisable) {
        shouldDisable = true
        reason = 'FORCE_NO_SANDBOX=1'
      }
      else if (forceEnable) {
        shouldDisable = false
        reason = 'FORCE_SANDBOX=1'
      }
      else {
        // 默认在 Linux 下禁用沙盒以提高兼容性
        shouldDisable = true
        reason = 'Default Linux compatibility mode'
        checkResults.defaultDisabled = true
      }

      // 应用配置
      if (shouldDisable) {
        app.commandLine.appendSwitch('no-sandbox')
        app.commandLine.appendSwitch('disable-dev-shm-usage')
        log.info(`Disabling Chromium sandbox: ${reason}`)
      }
      else {
        log.info('Chromium sandbox enabled')
      }

      const duration = Date.now() - startTime
      log.debug(`Sandbox configuration completed in ${duration}ms`)

      return {
        disabled: shouldDisable,
        reason,
        checks: checkResults,
        duration,
      }
    }
    catch (error) {
      log.error('Critical error during sandbox configuration:', error.message)
      // 出现严重错误时，为了安全起见禁用沙盒
      app.commandLine.appendSwitch('no-sandbox')
      app.commandLine.appendSwitch('disable-dev-shm-usage')

      return {
        disabled: true,
        reason: `Configuration error: ${error.message}`,
        checks: checkResults,
        error: true,
      }
    }
  }
}

const sandboxManager = new SandboxManager()

export default sandboxManager
