import type { ElectronApp, Plugin } from '../../main/types'
import { SandboxManager } from './helper'

/**
 * Sandbox plugin options
 */
export interface SandboxPluginOptions {
  /**
   * Custom service name for dependency injection
   * @default 'plugin:sandbox'
   */
  serviceName?: string

  /**
   * Custom event name for configuration success
   * @default 'sandbox:configured'
   */
  configuredEventName?: string

  /**
   * Custom event name for configuration error
   * @default 'sandbox:config-error'
   */
  errorEventName?: string

  /**
   * Process module (for testing)
   * @default process
   */
  processModule?: NodeJS.Process
}

/**
 * Sandbox configuration result
 */
export interface SandboxConfigResult {
  /**
   * Whether sandbox was disabled
   */
  disabled: boolean

  /**
   * Reason for the configuration decision
   */
  reason: string

  /**
   * Check results
   */
  checks?: Record<string, any>

  /**
   * Configuration duration in milliseconds
   */
  duration?: number

  /**
   * Whether an error occurred
   */
  error?: boolean
}

/**
 * Chromium sandbox configuration plugin
 *
 * Configures Chromium sandbox settings on Linux.
 * By default, disables sandbox for better compatibility.
 *
 * @example
 * ```ts
 * import { createElectronApp } from '@escrcpy/electron-modularity'
 * import { sandboxPlugin } from '@escrcpy/electron-modularity/plugins'
 *
 * const app = createElectronApp({ ... })
 *
 * app.use(sandboxPlugin)
 *
 * // Listen for configuration result
 * app.on('sandbox:configured', (result) => {
 *   console.log('Sandbox configured:', result)
 * })
 * ```
 *
 * ## Environment Variables
 * - `FORCE_SANDBOX=1` - Force enable sandbox
 * - `FORCE_NO_SANDBOX=1` - Force disable sandbox (takes precedence)
 *
 * ## Platform Behavior
 * - **Linux**: Sandbox disabled by default for compatibility
 * - **macOS/Windows**: No configuration needed (skipped)
 *
 * ## Load Order
 * This plugin uses `order: -100` to ensure it loads very early,
 * before app.commandLine becomes immutable.
 */
export const sandboxPlugin: Plugin<SandboxConfigResult, SandboxPluginOptions> = {
  name: 'plugin:sandbox',
  order: -100, // Load very early (before app ready)

  apply(app: ElectronApp, options: SandboxPluginOptions = {}) {
    const {
      serviceName = '',
      configuredEventName = 'sandbox:configured',
      errorEventName = 'sandbox:config-error',
      processModule = process,
    } = options

    // Override plugin name if custom service name is provided
    if (serviceName) {
      sandboxPlugin.name = serviceName
    }

    const manager = new SandboxManager({ processModule })

    try {
      const result = manager.configureSandbox()
      app?.emit?.(configuredEventName, result)
      return result
    }
    catch (error: any) {
      console.error('[plugin:sandbox] Failed to configure sandbox:', error)
      app?.emit?.(errorEventName, error)
      throw error
    }
  },
}

export default sandboxPlugin
