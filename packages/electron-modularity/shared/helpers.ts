import type { BrowserWindow } from 'electron'
import type { ElectronApp } from '../main/types'
import path from 'node:path'

/**
 * Load page in BrowserWindow
 * Supports both development server and production file loading
 *
 * @param win - BrowserWindow instance
 * @param options - Load options
 */
export function loadPage(
  win: BrowserWindow,
  options: {
    prefix?: string
    query?: Record<string, any> | string
    rendererDir?: string
    devRendererDir?: string
  },
) {
  const { prefix = '', query, rendererDir = '', devRendererDir } = options || {}

  let stringifyQuery = ''

  if (query) {
    if (typeof query === 'string') {
      stringifyQuery = query
    }
    else {
      // Filter out empty values and build query string
      const filteredQuery = Object.fromEntries(
        Object.entries(query).filter(([_, value]) => {
          if (value === null || value === undefined || value === '') {
            return false
          }
          if (typeof value === 'object' && Object.keys(value).length === 0) {
            return false
          }
          if (Array.isArray(value) && value.length === 0) {
            return false
          }
          return true
        }),
      )
      stringifyQuery = Object.keys(filteredQuery).length > 0
        ? `?${new URLSearchParams(filteredQuery).toString()}`
        : ''
    }
  }

  // Use development server if available
  if (devRendererDir) {
    const url = `${devRendererDir.replace(/\/$/, '')}/${prefix}${stringifyQuery}`
    win.loadURL(url)
  }
  else {
    win.loadFile(path.join(rendererDir, prefix, 'index.html'), {
      search: stringifyQuery,
    })
  }
}

/**
 * Resolve the main window instance from app context
 * This function waits for the main window to be ready if it's not available yet
 *
 * @param appContext - Electron app instance
 * @returns Promise resolving to main window or undefined
 *
 * @example
 * ```ts
 * const mainWindow = await resolveMainWindow(app)
 * mainWindow?.webContents.send('update-available')
 * ```
 */
export function resolveMainWindow(appContext?: ElectronApp): Promise<BrowserWindow | undefined> {
  const injected = appContext?.inject?.('modules:main')

  if (injected) {
    return Promise.resolve(injected)
  }

  return new Promise((resolve) => {
    if (!appContext?.once) {
      resolve(undefined)
      return
    }

    appContext.once('window:main:ready', (win: BrowserWindow) => {
      resolve(win)
    })
  })
}
