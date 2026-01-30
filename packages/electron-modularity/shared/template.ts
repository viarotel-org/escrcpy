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
 * @template TExtensions - Additional properties/methods type
 * @param options - Window options
 * @returns Proxied window instance with enhanced functionality
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
 * console.log(win.__instanceId) // Type-safe access to internal properties
 * ```
 */
export function createBrowserWindow<TExtensions = object>(
  options: TemplateBrowserWindowOptions,
): EnhancedBrowserWindow<TExtensions> {
  return new TemplateBrowserWindow(options).createProxy() as EnhancedBrowserWindow<TExtensions>
}

/**
 * Template wrapper for Electron BrowserWindow with enhanced features:
 * - Persistent window bounds
 * - External link handling
 * - Platform-specific title bar configuration
 * - Convenient page loading
 */
export class TemplateBrowserWindow {
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

    this.win = new BrowserWindow({
      ...defaultOptions,
      ...browserWindowOverrides,
    })

    if (this.options.persistenceBounds) {
      this.#onResize = debounce(this.#handleResize.bind(this), 500)
    }

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
    // Type-safe property assignment (will be in EnhancedBrowserWindow interface)
    const win = this.win as any
    win.customId = pagePath

    const loadPageFn = this.options.loadPage

    if (loadPageFn) {
      loadPageFn(this.win, {
        prefix: this.options.main ? '' : `${pagePath}/`,
        query,
        rendererDir: this.options.rendererDir,
        devRendererDir: this.options.devRendererDir,
      })
    }
    else {
      builtInLoadPage(this.win, {
        prefix: this.options.main ? '' : `${pagePath}/`,
        query,
        rendererDir: this.options.rendererDir,
        devRendererDir: this.options.devRendererDir,
      })
    }
  }

  /**
   * Create proxy to forward methods to underlying BrowserWindow
   * The proxy will have type EnhancedBrowserWindow with all additional properties
   */
  createProxy(): EnhancedBrowserWindow {
    return new Proxy(this, {
      get(target, prop: string | symbol) {
        if (prop in target) {
          return getProxyValue(target, prop)
        }

        return getProxyValue(target.win, prop)
      },
    }) as unknown as EnhancedBrowserWindow
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
    persistenceBounds,
    icon,
    width = 900,
    height = 650,
    minWidth,
    minHeight,
    backgroundColor = '#00000000',
  } = options

  const persistedBounds = (persistenceBounds ? storage.get(WINDOW_BOUNDS_KEY) : {}) || {}

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

    ...(persistedBounds as any),
    ...getTitleBarOptions(),
  }
}

/**
 * Get proxy value
 */
function getProxyValue(target: any, prop: string | symbol) {
  const value = target[prop]

  if (typeof value === 'function') {
    return value.bind(target)
  }

  return value
}
