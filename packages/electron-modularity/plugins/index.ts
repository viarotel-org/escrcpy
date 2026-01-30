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

export { themePlugin } from './theme/index.js'
export type { ThemePluginAPI, ThemePluginOptions } from './theme/index.js'

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
