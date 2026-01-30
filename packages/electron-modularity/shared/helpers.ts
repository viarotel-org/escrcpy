import type { BrowserWindow } from 'electron'
import type { ElectronApp } from '../main/types'
import path from 'node:path'
import { app as electronApp } from 'electron'

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
 *
 * This function handles timing issues by:
 * - Returning immediately if window is already registered
 * - Waiting for window registration if not yet available (with timeout)
 *
 * Resolution strategies:
 * 1. Custom resolver set via `app.setMainWindowResolver()` (highest priority)
 * 2. Registered main window via `app.registerMainWindow()` (recommended)
 * 3. Wait for 'main-window:registered' event if window not yet created (auto-fallback)
 *
 * @param appContext - Electron app instance
 * @param options - Resolution options
 * @param options.timeout - Maximum wait time in milliseconds (default: 10000)
 * @param options.throwOnTimeout - Throw error on timeout instead of returning undefined (default: false)
 * @returns Promise resolving to main window or undefined
 *
 * @example
 * ```ts
 * // In service initialization (handles timing automatically)
 * export default {
 *   async apply(app) {
 *     // Will wait if window not ready yet
 *     const mainWindow = await resolveMainWindow(app)
 *     if (!mainWindow) {
 *       console.warn('Main window not available')
 *       return
 *     }
 *     // Safe to use mainWindow here
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * // With custom timeout
 * const win = await resolveMainWindow(app, { timeout: 5000 })
 * ```
 *
 * @example
 * ```ts
 * // Throw error on timeout
 * try {
 *   const win = await resolveMainWindow(app, { throwOnTimeout: true })
 * } catch (error) {
 *   console.error('Timeout waiting for main window')
 * }
 * ```
 */
export async function resolveMainWindow(
  appContext?: ElectronApp,
  options: {
    timeout?: number
    throwOnTimeout?: boolean
  } = {},
): Promise<BrowserWindow | undefined> {
  const { timeout = 10000, throwOnTimeout = false } = options

  if (!appContext) {
    return undefined
  }

  // Strategy 1: Use custom resolver (highest priority)
  if (appContext._mainWindowResolver) {
    return await appContext._mainWindowResolver(appContext)
  }

  // Strategy 2: Check if main window is already registered
  const existingWindow = appContext.getMainWindow?.()
  if (existingWindow) {
    return existingWindow
  }

  // Strategy 3: Wait for main window registration (handles timing issues)
  // This ensures services can safely call resolveMainWindow during initialization
  // even if the main window is created later
  return new Promise((resolve, reject) => {
    // Set timeout to avoid infinite waiting
    const timeoutId = setTimeout(() => {
      // Clean up event listener
      if (appContext.off) {
        appContext.off('main-window:registered', onWindowRegistered)
      }

      const message = `Timeout (${timeout}ms) waiting for main window registration`
      if (throwOnTimeout) {
        reject(new Error(message))
      }
      else {
        console.warn(`[resolveMainWindow] ${message}`)
        resolve(undefined)
      }
    }, timeout)

    if (appContext.once) {
      appContext.once('main-window:registered', onWindowRegistered)
    }
    else {
      clearTimeout(timeoutId)
      resolve(undefined)
    }

    // Listen for main window registration event
    function onWindowRegistered(win: BrowserWindow) {
      clearTimeout(timeoutId)
      resolve(win)
    }
  })
}

/**
 * Restore and focus a browser window
 *
 * Handles common window restoration patterns:
 * - Restores minimized windows
 * - Shows hidden windows
 * - Optionally focuses the window
 * - Supports macOS dock show/hide
 *
 * @param win - BrowserWindow instance to restore
 * @param options - Restoration options
 * @param options.forceFocus - Force focus the window (default: true)
 * @param options.showDock - Show dock on macOS (default: true on macOS, false otherwise)
 * @returns true if window was restored, false if window is null/destroyed
 *
 * @example
 * ```ts
 * // Basic usage
 * restoreAndFocusWindow(mainWindow)
 *
 * // Without forcing focus
 * restoreAndFocusWindow(mainWindow, { forceFocus: false })
 *
 * // With explicit dock control
 * restoreAndFocusWindow(mainWindow, { showDock: true })
 * ```
 */
export function restoreAndFocusWindow(
  win: BrowserWindow | null | undefined,
  options: {
    forceFocus?: boolean
    showDock?: boolean
  } = {},
): boolean {
  if (!win || win.isDestroyed?.()) {
    return false
  }

  const { forceFocus = true, showDock = process.platform === 'darwin' } = options

  // Restore if minimized
  if (win.isMinimized?.()) {
    win.restore?.()
  }

  // Show if hidden
  if (!win.isVisible?.()) {
    win.show?.()
  }

  // Focus if requested
  if (forceFocus) {
    win.focus?.()
  }

  // Show dock on macOS if requested
  if (showDock && process.platform === 'darwin') {
    electronApp?.dock?.show?.()
  }

  return true
}
