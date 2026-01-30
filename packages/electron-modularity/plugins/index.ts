/**
 * Official plugins for @escrcpy/electron-modularity
 *
 * @packageDocumentation
 */

/**
 * Plugin presets for common use cases
 */

import type { Plugin } from '../main/types.js'
import { themePlugin } from './theme/index.js'
import { windowIPCPlugin } from './window-ipc/index.js'
import { clipboardPlugin } from './clipboard/index.js'
import { executeArgumentsPlugin } from './execute-arguments/index.js'
import { singletonPlugin } from './singleton/index.js'
import { sandboxPlugin } from './sandbox/index.js'

// Clipboard plugin
export { clipboardPlugin } from './clipboard/index.js'
export type { ClipboardPluginAPI, ClipboardPluginOptions } from './clipboard/index.js'

// Execute arguments plugin
export { executeArgumentsPlugin } from './execute-arguments/index.js'
export type { ExecuteArgumentsPluginAPI, ExecuteArgumentsPluginOptions } from './execute-arguments/index.js'

// Sandbox plugin
export { sandboxPlugin } from './sandbox/index.js'
export type { SandboxConfigResult, SandboxPluginOptions } from './sandbox/index.js'

// Singleton plugin
export { singletonPlugin } from './singleton/index.js'
export type { SingletonPluginOptions } from './singleton/index.js'

// Theme plugin
export { themePlugin } from './theme/index.js'
export type { ThemePluginAPI, ThemePluginOptions } from './theme/index.js'

// Window IPC plugin
export { windowIPCPlugin } from './window-ipc/index.js'
export type { WindowIPCPluginOptions } from './window-ipc/index.js'

/**
 * Essential plugins preset
 * Includes theme and window IPC handlers
 */
export function essentialPlugins(): Plugin<unknown, unknown>[] {
  return [
    themePlugin as Plugin<unknown, unknown>,
    windowIPCPlugin as Plugin<unknown, unknown>,
  ]
}

/**
 * Minimal plugins preset
 * Only window IPC handlers
 */
export function minimalPlugins(): Plugin<unknown, unknown>[] {
  return [
    windowIPCPlugin as Plugin<unknown, unknown>,
  ]
}

/**
 * Core system plugins preset
 * Includes sandbox, execute-arguments, singleton, and clipboard
 * These plugins provide core Electron app functionality
 */
export function coreSystemPlugins(): Plugin<unknown, unknown>[] {
  return [
    sandboxPlugin as Plugin<unknown, unknown>, // order: -100 (load first)
    executeArgumentsPlugin as Plugin<unknown, unknown>, // order: 0
    singletonPlugin as Plugin<unknown, unknown>, // order: -50, deps: ['plugin:execute-arguments']
    clipboardPlugin as Plugin<unknown, unknown>, // order: 0
  ]
}

/**
 * Full plugins preset
 * Includes all official plugins (system + UI)
 */
export function fullPlugins(): Plugin<unknown, unknown>[] {
  return [
    sandboxPlugin as Plugin<unknown, unknown>,
    executeArgumentsPlugin as Plugin<unknown, unknown>,
    singletonPlugin as Plugin<unknown, unknown>,
    clipboardPlugin as Plugin<unknown, unknown>,
    themePlugin as Plugin<unknown, unknown>,
    windowIPCPlugin as Plugin<unknown, unknown>,
  ]
}
