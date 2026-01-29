import { app } from 'electron'

/**
 * Sandbox configuration manager (simplified)
 * Defaults to disabling the Chromium sandbox on Linux to improve compatibility
 */
class SandboxManager {
  /**
   * Constructor
   * @param {Object} options - Configuration options
   * @param {Object} options.processModule - Process module
   */
  constructor({
    processModule = process,
  } = {}) {
    this.process = processModule
  }

  /**
   * Sanitize environment variable value
   * @param {string|undefined} value - Environment variable value
   * @returns {string} Sanitized value
   */
  _sanitizeEnvVar(value) {
    if (typeof value !== 'string') {
      return ''
    }
    return value.trim()
  }

  /**
   * Configure sandbox settings (simplified)
   * @returns {Promise<{disabled: boolean, reason: string, checks?: Object}>} Configuration result
   */
  async configureSandbox() {
    const startTime = Date.now()

    // Return early on non-Linux platforms
    if (this.process.platform !== 'linux') {
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
      // Check env vars for overrides
      const forceEnable = this._sanitizeEnvVar(this.process.env.FORCE_SANDBOX) === '1'
      const forceDisable = this._sanitizeEnvVar(this.process.env.FORCE_NO_SANDBOX) === '1'

      checkResults.forceEnable = forceEnable
      checkResults.forceDisable = forceDisable

      if (forceDisable && forceEnable) {
        console.warn('Both FORCE_NO_SANDBOX and FORCE_SANDBOX are set, prioritizing FORCE_NO_SANDBOX')
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
        // Default to disabling sandbox on Linux for compatibility
        shouldDisable = true
        reason = 'Default Linux compatibility mode'
        checkResults.defaultDisabled = true
      }

      // Apply configuration
      if (shouldDisable) {
        app.commandLine.appendSwitch('no-sandbox')
        app.commandLine.appendSwitch('disable-dev-shm-usage')
        console.info(`Disabling Chromium sandbox: ${reason}`)
      }
      else {
        console.info('Chromium sandbox enabled')
      }

      const duration = Date.now() - startTime
      console.debug(`Sandbox configuration completed in ${duration}ms`)

      return {
        disabled: shouldDisable,
        reason,
        checks: checkResults,
        duration,
      }
    }
    catch (error) {
      console.error('Critical error during sandbox configuration:', error.message)
      // On critical errors, disable sandbox for safety
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

export const sandboxManager = new SandboxManager()
