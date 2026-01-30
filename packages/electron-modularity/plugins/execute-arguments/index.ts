import minimist from 'minimist'
import { snakeCase, toUpper } from 'lodash-es'
import type { ElectronApp, Plugin } from '../../main/types'

/**
 * Execute arguments plugin options
 */
export interface ExecuteArgumentsPluginOptions {
  /**
   * Custom service name for dependency injection
   * @default ''
   */
  serviceName?: string

  /**
   * Environment variable prefix for injected arguments
   * @default 'EXECUTE_ARG_'
   */
  envPrefix?: string
}

/**
 * Execute arguments plugin API
 */
export interface ExecuteArgumentsPluginAPI {
  /**
   * Parse command-line arguments into an object
   * @param commandLine - Array of command-line arguments
   * @returns Parsed arguments object
   */
  parseExecuteArguments(commandLine: string[]): minimist.ParsedArgs

  /**
   * Inject parsed arguments into process.env as prefixed variables
   * @param executeArgs - Parsed arguments object
   */
  injectExecuteArguments(executeArgs: Record<string, any>): void

  /**
   * Get initial arguments parsed on startup
   * @returns Initial parsed arguments
   */
  getArguments(): minimist.ParsedArgs
}

/**
 * Command-line arguments parser and environment injector plugin
 *
 * Parses command-line arguments and injects them into process.env
 * for use across the application.
 *
 * @example
 * ```ts
 * import { createElectronApp } from '@escrcpy/electron-modularity'
 * import { executeArgumentsPlugin } from '@escrcpy/electron-modularity/plugins'
 *
 * const app = createElectronApp({ ... })
 *
 * app.use(executeArgumentsPlugin, {
 *   envPrefix: 'EXECUTE_ARG_'
 * })
 *
 * // Access API
 * const argsAPI = app.inject<ExecuteArgumentsPluginAPI>('plugin:execute-arguments')
 * const args = argsAPI.getArguments()
 * console.log(args) // { deviceId: 'xxx', ... }
 *
 * // Environment variables are available
 * console.log(process.env.EXECUTE_ARG_DEVICE_ID) // 'xxx'
 * ```
 *
 * ## Command Line Usage
 * ```bash
 * # Start app with arguments
 * ./app --device-id=12345 --app-name=MyApp
 *
 * # Arguments are converted to environment variables
 * # EXECUTE_ARG_DEVICE_ID=12345
 * # EXECUTE_ARG_APP_NAME=MyApp
 * ```
 */
export const executeArgumentsPlugin: Plugin<ExecuteArgumentsPluginAPI, ExecuteArgumentsPluginOptions> = {
  name: 'plugin:execute-arguments',
  order: 0,

  apply(electronApp: ElectronApp, options: ExecuteArgumentsPluginOptions = {}) {
    const {
      serviceName = 'plugin:execute-arguments',
      envPrefix = 'EXECUTE_ARG_',
    } = options

    // Override plugin name if custom service name is provided
    if (serviceName) {
      executeArgumentsPlugin.name = serviceName
    }

    /**
     * Parse command-line arguments into an object
     */
    function parseExecuteArguments(commandLine: string[]): minimist.ParsedArgs {
      return minimist(commandLine)
    }

    /**
     * Inject parsed arguments into process.env as prefixed variables
     */
    function injectExecuteArguments(executeArgs: Record<string, any>): void {
      Object.entries(executeArgs).forEach(([key, value]) => {
        // Skip underscore (minimist's default for positional args) and boolean properties
        if (key === '_' || typeof value === 'boolean') {
          return
        }

        const envKey = `${envPrefix}${toUpper(snakeCase(key))}`
        process.env[envKey] = String(value)
      })
    }

    // Parse and inject initial arguments
    const initialArgs = parseExecuteArguments(process.argv)
    injectExecuteArguments(initialArgs)

    const api: ExecuteArgumentsPluginAPI = {
      parseExecuteArguments,
      injectExecuteArguments,
      getArguments() {
        return initialArgs
      },
    }

    return api
  },
}

export default executeArgumentsPlugin
