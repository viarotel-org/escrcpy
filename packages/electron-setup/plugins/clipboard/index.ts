import type { ElectronApp, Plugin } from '../../main/types'
import { clipboard, ipcMain } from 'electron'
import { copyFilesToClipboard } from './helper'

/**
 * Clipboard plugin options
 */
export interface ClipboardPluginOptions {
  /**
   * Custom IPC channel prefix
   * @default ''
   */
  ipcPrefix?: string

  /**
   * Custom service name for dependency injection
   * @default ''
   */
  serviceName?: string
}

/**
 * Clipboard plugin API
 */
export interface ClipboardPluginAPI {
  /**
   * Copy a single file to system clipboard
   * @param filePath - Absolute path to the file
   * @returns Promise with success status and message
   */
  copyFile(filePath: string): Promise<{ success: boolean, message: string }>

  /**
   * Copy one or more files to system clipboard at once
   * @param filePaths - Absolute paths to the files
   * @returns Promise with success status and message
   */
  copyFiles(filePaths: string[]): Promise<{ success: boolean, message: string }>

  /**
   * Copy text to system clipboard
   * @param text - Text content to copy
   * @returns Promise with success status and message
   */
  copyText(text: string): Promise<{ success: boolean, message: string }>
}

/**
 * System clipboard management plugin
 *
 * Provides cross-platform clipboard operations for files and text.
 * Supports macOS, Windows, and Linux with platform-specific formats.
 *
 * @example
 * ```ts
 * import { createElectronApp } from '@escrcpy/electron-setup'
 * import { clipboardPlugin } from '@escrcpy/electron-setup/plugins'
 *
 * const app = createElectronApp({ ... })
 *
 * app.use(clipboardPlugin, {
 *   serviceName: 'plugin:clipboard',
 *   ipcPrefix: ''
 * })
 *
 * // Access API
 * const clipboardAPI = app.inject<ClipboardPluginAPI>('plugin:clipboard')
 * await clipboardAPI.copyFile('/path/to/file.png')
 * await clipboardAPI.copyText('Hello World')
 * ```
 */
export const clipboardPlugin: Plugin<ClipboardPluginAPI, ClipboardPluginOptions> = {
  name: 'plugin:clipboard',
  priority: 'normal',

  apply(mainApp: ElectronApp, options: ClipboardPluginOptions = {}) {
    const {
      ipcPrefix = '',
      serviceName = '',
    } = options

    // Override plugin name if custom service name is provided
    if (serviceName) {
      clipboardPlugin.name = serviceName
    }

    const api: ClipboardPluginAPI = {
      async copyFile(filePath: string) {
        return api.copyFiles([filePath])
      },

      async copyFiles(filePaths: string[]) {
        try {
          if (!filePaths || filePaths.length === 0) {
            throw new Error('File paths are required')
          }

          const success = await copyFilesToClipboard(filePaths)

          return {
            success,
            message: success ? 'Files copied to clipboard successfully' : 'Failed to copy files to clipboard',
          }
        }
        catch (error: any) {
          console.error('Clipboard copyFiles error:', error.message)
          return {
            success: false,
            message: error.message,
          }
        }
      },

      async copyText(text: string) {
        try {
          if (!text) {
            throw new Error('Text is required')
          }

          clipboard.writeText(text)

          return {
            success: true,
            message: 'Text copied to clipboard successfully',
          }
        }
        catch (error: any) {
          console.error('Clipboard copyText error:', error.message)
          return {
            success: false,
            message: error.message,
          }
        }
      },
    }

    // Register IPC handlers
    const handlers: Array<{ channel: string, handler: (event: any, ...args: any[]) => Promise<any> }> = [
      {
        channel: `${ipcPrefix}copy-file-to-clipboard`,
        handler: async (_, filePath: string | string[]) =>
          api.copyFiles(Array.isArray(filePath) ? filePath : [filePath]),
      },
      {
        channel: `${ipcPrefix}copy-text-to-clipboard`,
        handler: async (_, text: string) => api.copyText(text),
      },
    ]

    handlers.forEach(({ channel, handler }) => {
      ipcMain.handle(channel, handler)
    })

    // Cleanup handler
    const cleanup = () => {
      handlers.forEach(({ channel }) => {
        ipcMain.removeHandler(channel)
      })
    }

    return {
      ...api,
      dispose: cleanup,
    }
  },
}

export default clipboardPlugin
