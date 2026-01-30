import { ipcMain, nativeTheme } from 'electron'
import type { ElectronApp, Plugin } from '../../main/types'

/**
 * Theme plugin options
 */
export interface ThemePluginOptions {
  /**
   * Storage key prefix for theme persistence
   * @default 'common'
   */
  storagePrefix?: string

  /**
   * Whether to persist theme changes to storage
   * @default true
   */
  persist?: boolean

  /**
   * Custom IPC channel prefix
   * @default 'app-theme'
   */
  ipcPrefix?: string
}

/**
 * Theme plugin API
 */
export interface ThemePluginAPI {
  /**
   * Get current theme source
   */
  value(): 'system' | 'light' | 'dark'

  /**
   * Update theme source
   */
  update(theme: 'system' | 'light' | 'dark'): void

  /**
   * Check if system prefers dark mode
   */
  isDark(): boolean
}

/**
 * Native theme management plugin
 *
 * Provides IPC handlers for theme control and automatic persistence.
 *
 * @example
 * ```ts
 * import { createElectronApp } from '@escrcpy/electron-modularity'
 * import { themePlugin } from '@escrcpy/electron-modularity/plugins'
 *
 * const app = createElectronApp({ ... })
 *
 * app.use(themePlugin, {
 *   storagePrefix: 'app',
 *   persist: true
 * })
 *
 * // Access API
 * const themeAPI = app.inject<ThemePluginAPI>('plugin:theme')
 * console.log(themeAPI.value()) // 'system' | 'light' | 'dark'
 * ```
 */
export const themePlugin: Plugin<ThemePluginAPI, ThemePluginOptions> = {
  name: 'plugin:theme',
  priority: 'pre', // Load early

  apply(electronApp: ElectronApp, options: ThemePluginOptions = {}) {
    const {
      storagePrefix = 'common',
      persist = true,
      ipcPrefix = 'app-theme',
    } = options

    const appTheme: ThemePluginAPI = {
      value() {
        return nativeTheme.themeSource
      },

      update(value: 'system' | 'light' | 'dark') {
        nativeTheme.themeSource = value
      },

      isDark() {
        return nativeTheme.shouldUseDarkColors
      },
    }

    // Register IPC handlers
    const handlers: Array<{ channel: string, handler: (event: any, value?: any) => any }> = [
      {
        channel: `${ipcPrefix}-value`,
        handler: () => appTheme.value(),
      },
      {
        channel: `${ipcPrefix}-update`,
        handler: (_, value) => appTheme.update(value),
      },
      {
        channel: `${ipcPrefix}-isDark`,
        handler: () => appTheme.isDark(),
      },
    ]

    handlers.forEach(({ channel, handler }) => {
      ipcMain.handle(channel, handler)
    })

    // Persistence logic
    let onUpdated: (() => void) | undefined

    if (persist && electronApp.storage) {
      onUpdated = () => {
        try {
          electronApp.storage?.set(`${storagePrefix}.theme`, appTheme.value())
          electronApp.storage?.set(`${storagePrefix}.isDark`, appTheme.isDark())
        }
        catch (error) {
          electronApp.emit('plugin:error', error, { name: 'plugin:theme' })
        }
      }

      nativeTheme.on('updated', onUpdated)
    }

    // Cleanup handler
    const cleanup = () => {
      // Remove IPC handlers
      handlers.forEach(({ channel, handler }) => {
        ipcMain.removeHandler(channel)
      })

      // Remove theme listener
      if (onUpdated) {
        nativeTheme.off('updated', onUpdated)
      }
    }

    return {
      ...appTheme,
      dispose: cleanup,
    }
  },
}

export default themePlugin
