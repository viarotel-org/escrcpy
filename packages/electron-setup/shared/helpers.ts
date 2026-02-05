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
 * Resolve the main window from app context.
 *
 * Resolution order:
 * 1. Custom resolver (`mainApp.setMainWindowResolver`)
 * 2. Registered main window (`mainApp.registerMainWindow`)
 * 3. Wait for `main-window:registered` event (with timeout)
 *
 * @param mainApp - Electron app instance
 * @param options - Resolve options
 * @param options.timeout - Max wait time in ms (default: 10000)
 * @param options.throwOnTimeout - Throw on timeout instead of returning undefined
 * @returns Promise resolving to the main window or undefined
 *
 * @example
 * const win = await resolveMainWindow(mainApp, { timeout: 5000 })
 */
export async function resolveMainWindow(
  mainApp?: ElectronApp,
  options: {
    timeout?: number
    throwOnTimeout?: boolean
  } = {},
): Promise<BrowserWindow | undefined> {
  const { timeout = 10000, throwOnTimeout = false } = options

  if (!mainApp) {
    return undefined
  }

  // Strategy 1: Use custom resolver (highest priority)
  if (mainApp._mainWindowResolver) {
    return await mainApp._mainWindowResolver(mainApp)
  }

  // Strategy 2: Check if main window is already registered
  const existingWindow = mainApp.getMainWindow?.()
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
      if (mainApp.off) {
        mainApp.off('main-window:registered', onWindowRegistered)
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

    if (mainApp.once) {
      mainApp.once('main-window:registered', onWindowRegistered)
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
 *
 * @param val
 * @returns Base64 encoded string
 */
export function encodePayload(val: unknown): string {
  const json = JSON.stringify(val ?? null)
  return Buffer.from(json, 'utf8').toString('base64')
}

/**
 *
 * @param val Base64 encoded string
 * @returns Decoded payload object
 */
export function decodePayload<T = unknown>(val: string): T {
  try {
    const jsonString = Buffer.from(val, 'base64').toString('utf8')
    return JSON.parse(jsonString) as T
  }
  catch (err) {
    return null as unknown as T
  }
}
