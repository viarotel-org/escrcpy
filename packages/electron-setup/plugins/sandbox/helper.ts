import { app } from 'electron'

/**
 * Sandbox configuration manager options
 */
export interface SandboxManagerOptions {
  /**
   * Process module (for testing)
   */
  processModule?: NodeJS.Process
}

/**
 * Sandbox configuration result
 */
export interface SandboxConfigResult {
  disabled: boolean
  reason: string
  checks?: Record<string, any>
  duration?: number
  error?: boolean
}

/**
 * Sandbox configuration manager
 *
 * Manages Chromium sandbox settings on Linux.
 * Defaults to disabling the sandbox to improve compatibility.
 */
export class SandboxManager {
  private process: NodeJS.Process

  /**
   * Constructor
   * @param options - Configuration options
   */
  constructor(options: SandboxManagerOptions = {}) {
    this.process = options.processModule || process
  }

  /**
   * Sanitize environment variable value
   * @param value - Environment variable value
   * @returns Sanitized value
   */
  private _sanitizeEnvVar(value: string | undefined): string {
    if (typeof value !== 'string') {
      return ''
    }
    return value.trim()
  }

  /**
   * Configure sandbox settings
   * @returns Configuration result
   */
  configureSandbox(): SandboxConfigResult {
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
    const checkResults: Record<string, any> = {}

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
    catch (error: any) {
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
