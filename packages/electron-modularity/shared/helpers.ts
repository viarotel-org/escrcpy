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
 * This function supports multiple resolution strategies:
 * 1. Use custom resolver if set via app.setMainWindowResolver()
 * 2. Use registered main window via app.registerMainWindow()
 * 3. Fall back to legacy behavior (inject 'modules:main' or wait for 'window:main:ready' event)
 *
 * @param appContext - Electron app instance
 * @returns Promise resolving to main window or undefined
 *
 * @example
 * ```ts
 * // Recommended: Register main window in business layer
 * const mainWindow = await manager.open()
 * app.registerMainWindow(mainWindow)
 * 
 * // Then resolve anywhere
 * const win = await resolveMainWindow(app)
 * win?.webContents.send('update-available')
 * ```
 * 
 * @example
 * ```ts
 * // Custom resolver for complex scenarios
 * app.setMainWindowResolver(async (app) => {
 *   const manager = app.getWindowManager('main')
 *   return manager?.get()
 * })
 * 
 * const win = await resolveMainWindow(app)
 * ```
 */
export async function resolveMainWindow(appContext?: ElectronApp): Promise<BrowserWindow | undefined> {
  if (!appContext) {
    return undefined
  }

  // Strategy 1: Use custom resolver (highest priority)
  if (appContext._mainWindowResolver) {
    return await appContext._mainWindowResolver(appContext)
  }

  // Strategy 2: Use registered main window
  const registered = appContext.getMainWindow?.()
  if (registered) {
    return registered
  }

  // Strategy 3: Fall back to legacy DI/event-based resolution
  // This maintains backward compatibility but is NOT recommended for new code
  const injected = appContext.inject?.('modules:main')
  if (injected) {
    return injected as BrowserWindow
  }

  // Strategy 4: Wait for legacy event (backward compatibility)
  return new Promise((resolve) => {
    if (!appContext.once) {
      resolve(undefined)
      return
    }

    // Set a timeout to avoid infinite waiting
    const timeout = setTimeout(() => {
      resolve(undefined)
    }, 10000) // 10 second timeout

    appContext.once('window:main:ready', (win: BrowserWindow) => {
      clearTimeout(timeout)
      resolve(win)
    })
  })
}
