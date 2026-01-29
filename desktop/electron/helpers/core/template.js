import path from 'node:path'
import { BrowserWindow, shell } from 'electron'
import { debounce } from 'lodash-es'

import {
  browserWindowHeight,
  browserWindowWidth,
  getLogoPath,
} from '$electron/configs/index.js'

import {
  getAppBackgroundColor,
  loadPage,
} from '$electron/helpers/index.js'

import electronStore from '$electron/helpers/store/index.js'

/**
 * Electron Store key for persisting window bounds
 * @type {string}
 */
const WINDOW_BOUNDS_KEY = 'common.bounds'

export function createBrowserWindow(options) {
  return new TemplateBrowserWindow(options).createProxy()
}

/**
 * Template wrapper for Electron BrowserWindow
 */
export class TemplateBrowserWindow {
  /**
   * Underlying BrowserWindow instance
   * @type {BrowserWindow}
   */
  win

  /**
   * Debounced resize handler
   * @type {() => void}
   */
  #onResize

  /**
   * Create TemplateBrowserWindow instance
   *
   * @param {Object}
   */
  options = {}

  /**
   * @param {Object} options
   * @param {string} options.preloadDir - Absolute preload directory (required)
   * @param {import('electron').BrowserWindowConstructorOptions} [options.browserWindowOverrides]
   */
  constructor(options = {}) {
    const { preloadDir, persistenceBounds = false, ...browserWindowOverrides } = options
    this.options = options

    if (!preloadDir) {
      throw new Error('TemplateBrowserWindow: preloadDir is required')
    }

    const defaultOptions = createDefaultWindowOptions({ preloadDir, persistenceBounds })

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
   * Load renderer page
   *
   * @param {string} [prefix] - Page prefix
   * @param {Record<string, any>} [query] - Optional query parameters
   */
  loadPage(prefix = 'main', query) {
    this.win.customId = prefix
    loadPage(this.win, `${prefix}/`, query)
  }

  /**
   * Create proxy to forward methods to underlying BrowserWindow
   */
  createProxy() {
    return new Proxy(this, {
      get(target, prop) {
        if (prop in target) {
          return getProxyValue(target, prop)
        }

        return getProxyValue(target.win, prop)
      },
    })
  }

  /**
   * Bind internal window events
   * @private
   */
  #bindEvents() {
    if (this.options.persistenceBounds) {
      this.win.on('resize', this.#onResize)
    }

    this.win.on('closed', () => {
      this.#onResize?.cancel?.()
      this.win = null
    })
  }

  /**
   * Prevent new windows and open external links in browser
   * @private
   */
  #setupExternalLinkHandler() {
    this.win.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url)
      return { action: 'deny' }
    })
  }

  /**
   * Persist window bounds on resize
   * @private
   */
  #handleResize() {
    if (this.win.isDestroyed() || this.win.isMaximized()) {
      return
    }

    const { width, height } = this.win.getBounds()

    electronStore.set(WINDOW_BOUNDS_KEY, { width, height })
  }
}

/**
 * Resolve platform value (supports simulation via env)
 * @returns {NodeJS.Platform}
 */
function resolvePlatform() {
  return import.meta.env.VITE_SIMULATION_PLATFORM ?? process.platform
}

/**
 * Get platform-specific title bar options
 * @returns {import('electron').BrowserWindowConstructorOptions}
 */
function getTitleBarOptions() {
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
 *
 * @param {Object} params
 * @param {string} params.preloadDir - Absolute preload directory
 * @returns {import('electron').BrowserWindowConstructorOptions}
 */
function createDefaultWindowOptions({ preloadDir, persistenceBounds }) {
  const persistedBounds = (persistenceBounds ? electronStore.get(WINDOW_BOUNDS_KEY) : {}) || {}

  return {
    show: false,
    icon: getLogoPath(),

    width: browserWindowWidth,
    height: browserWindowHeight,
    minWidth: browserWindowWidth,
    minHeight: browserWindowHeight,

    autoHideMenuBar: true,
    backgroundColor: getAppBackgroundColor(),

    webPreferences: {
      preload: path.join(preloadDir, 'preload.mjs'),
      nodeIntegration: true,
      sandbox: false,
      spellcheck: false,
    },

    ...persistedBounds,
    ...getTitleBarOptions(),
  }
}

/**
 * Get proxy value
 * @param {any} target
 * @param {string|symbol} prop
 */
function getProxyValue(target, prop) {
  const value = target[prop]

  if (typeof value === 'function') {
    return value.bind(target)
  }

  return value
}
