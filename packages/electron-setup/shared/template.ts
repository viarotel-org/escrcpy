import path from 'node:path'
import { BrowserWindow, shell } from 'electron'
import { debounce } from 'es-toolkit'
import { loadPage as builtInLoadPage } from './helpers.js'
import { createDefaultStorage } from './adapters/storage-adapter.js'
import type { BrowserWindowConstructorOptions } from 'electron'
import type { EnhancedBrowserWindow, TemplateBrowserWindowOptions } from '../main/types'
import type { IStorage } from './interfaces'

/**
 * Electron Store key for persisting window bounds
 */
const WINDOW_BOUNDS_KEY = 'common.bounds'

/**
 * Create a BrowserWindow with standard template configuration
 *
 * @param options - Window options
 * @returns TemplateBrowserWindow instance with enhanced functionality
 *
 * @example
 * ```ts
 * const win = createBrowserWindow({
 *   preloadDir: __dirname,
 *   rendererDir: path.join(__dirname, '../dist'),
 *   persistenceBounds: true,
 * })
 *
 * win.loadPage('main')
 * win.raw.show() // Access raw BrowserWindow
 * win.raw.focus() // All BrowserWindow methods accessed via .raw
 * ```
 */
export function createBrowserWindow(
  options: TemplateBrowserWindowOptions,
): TemplateBrowserWindow {
  return new TemplateBrowserWindow(options)
}

/**
 * Template wrapper for Electron BrowserWindow with enhanced features:
 * - Persistent window bounds
 * - External link handling
 * - Platform-specific title bar configuration
 * - Convenient page loading
 *
 */
export class TemplateBrowserWindow implements EnhancedBrowserWindow {
  /**
   * Underlying BrowserWindow instance
   */
  win: BrowserWindow

  /**
   * Debounced resize handler
   */
  #onResize?: ReturnType<typeof debounce>

  /**
   * Window options
   */
  options: TemplateBrowserWindowOptions

  /**
   * Storage adapter for window state persistence
   */
  #storage: IStorage

  /**
   * manager ID
   */
  managerId?: string

  /**
   * instance ID
   */
  instanceId?: string

  /**
   * Create TemplateBrowserWindow instance
   *
   * @param options - Window configuration options
   */
  constructor(options: TemplateBrowserWindowOptions = {}) {
    this.options = options
    this.#storage = options.storage || createDefaultStorage()

    const { preloadDir, persistenceBounds = false, ...browserWindowOverrides } = options

    if (!preloadDir) {
      throw new Error('TemplateBrowserWindow: preloadDir is required')
    }

    const defaultOptions = createDefaultWindowOptions(options, this.#storage)

    const persistedBounds = {}

    if (this.options.persistenceBounds) {
      this.#onResize = debounce(this.#handleResize.bind(this), 500)
      Object.assign(persistedBounds, this.#storage.get(WINDOW_BOUNDS_KEY) ?? {})
    }

    this.win = new BrowserWindow({
      ...defaultOptions,
      ...browserWindowOverrides,
      ...persistedBounds,
    })

    this.#bindEvents()
    this.#setupExternalLinkHandler()
  }

  /**
   * Get raw BrowserWindow instance
   */
  get raw() {
    return this.win
  }

  /**
   * Load renderer page
   *
   * @param pagePath - Page path
   * @param query - Optional query parameters
   */
  loadPage(pagePath: string = 'main', query?: Record<string, any>) {
    // Bind customId to raw BrowserWindow instance
    (this.win as any).customId = pagePath

    const loadPageFn = this.options.loadPage ?? builtInLoadPage

    loadPageFn(this.win, {
      prefix: this.options.mainWindow ? '' : `${pagePath}/`,
      query,
      rendererDir: this.options.rendererDir,
      devRendererDir: this.options.devRendererDir,
    })
  }

  /**
   * Bind internal window events
   */
  #bindEvents() {
    if (this.options.persistenceBounds && this.#onResize) {
      this.win.on('resize', this.#onResize)
    }

    this.win.on('closed', () => {
      this.#onResize?.cancel?.()
      this.win = null as any
    })
  }

  /**
   * Prevent new windows and open external links in browser
   */
  #setupExternalLinkHandler() {
    this.win.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url)
      return { action: 'deny' }
    })
  }

  /**
   * Persist window bounds on resize
   */
  #handleResize() {
    if (!this.win || this.win.isDestroyed() || this.win.isMaximized()) {
      return
    }

    const { width, height } = this.win.getBounds()

    this.#storage.set(WINDOW_BOUNDS_KEY, { width, height })
  }
}

/**
 * Resolve platform value (supports simulation via env)
 */
function resolvePlatform(): NodeJS.Platform {
  return ((import.meta as any).env?.VITE_SIMULATION_PLATFORM as NodeJS.Platform) ?? process.platform
}

/**
 * Get platform-specific title bar options
 */
function getTitleBarOptions(): BrowserWindowConstructorOptions {
  const platform = resolvePlatform()

  if (platform === 'darwin') {
    return { titleBarStyle: 'hiddenInset' }
  }

  if (platform === 'win32' || platform === 'linux') {
    return { frame: false }
  }

  return {}
}

/**
 * Create default BrowserWindow options with persisted bounds
 */
function createDefaultWindowOptions(
  options: TemplateBrowserWindowOptions,
  storage: IStorage,
): BrowserWindowConstructorOptions {
  const {
    preloadDir,
    icon,
    width = 900,
    height = 650,
    minWidth,
    minHeight,
    backgroundColor = '#00000000',
  } = options

  return {
    show: false,
    icon,

    width,
    height,
    minWidth: minWidth ?? width,
    minHeight: minHeight ?? height,

    autoHideMenuBar: true,
    backgroundColor,

    webPreferences: {
      preload: path.join(preloadDir!, 'preload.mjs'),
      nodeIntegration: true,
      sandbox: false,
      spellcheck: false,
    },

    ...getTitleBarOptions(),
  }
}
