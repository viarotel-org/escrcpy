import type { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import type { IStorage } from '../shared/interfaces'

/**
 * Plugin interface for Electron app
 */
export interface Plugin<T = any> {
  /**
   * Unique plugin name (used for dependency resolution and service injection)
   */
  name?: string

  /**
   * Plugin load order (lower numbers load first)
   */
  order?: number

  /**
   * Plugin dependencies (other plugin names)
   */
  deps?: string[]

  /**
   * Plugin installation function
   * @param app - The Electron app instance
   * @param options - Plugin options
   * @returns Plugin API or cleanup function
   */
  apply: (app: ElectronApp, options?: any) => T

  /**
   * Cleanup function called when app stops
   */
  dispose?: () => void | Promise<void>
}

/**
 * Plugin state tracking
 */
export interface PluginState<T = any> {
  name: string
  api: T
  dispose?: () => void | Promise<void>
  order: number
  deps: string[]
  plugin: Plugin<T>
}

/**
 * Core Electron app instance with plugin system and dependency injection
 */
export interface ElectronApp {
  /**
   * App name
   */
  name?: string

  /**
   * Preload scripts directory
   */
  preloadDir?: string

  /**
   * Renderer pages directory
   */
  rendererDir?: string

  /**
   * Development server URL
   */
  devRendererDir?: string

  /**
   * Page loader function
   */
  loadPage?: (win: BrowserWindow, options: { prefix: string, query?: Record<string, any>, rendererDir?: string, devRendererDir?: string }) => void

  /**
   * Default window icon
   */
  icon?: string

  /**
   * Default window width
   */
  width?: number

  /**
   * Default window height
   */
  height?: number

  /**
   * Default window background color
   */
  backgroundColor?: string

  /**
   * Storage adapter for persisting app and window state
   */
  storage?: IStorage

  /**
   * Internal provides map
   */
  provides: Map<string, any>

  /**
   * Registered window managers
   */
  windows: Map<string, WindowManager>

  /**
   * Plugin states
   */
  pluginStates: Map<string, PluginState>

  /**
   * Inject a service or value
   * @param key - Service key
   * @param value - Service value
   */
  provide<T>(key: string, value: T): this

  /**
   * Retrieve an injected service or value
   * @param key - Service key
   * @param fallback - Fallback value if key not found
   */
  inject: <T = any>(key: string, fallback?: T) => T | undefined

  /**
   * Check if a service exists
   * @param key - Service key
   */
  has: (key: string) => boolean

  /**
   * Register a plugin
   * @param plugin - Plugin to register
   * @param options - Plugin options
   */
  use<T>(plugin: Plugin<T> | ((app: ElectronApp, options?: any) => T), options?: any): this

  /**
   * Register a window manager
   * @param id - Window manager identifier
   * @param manager - Window manager instance
   */
  registerWindowManager(id: string, manager: WindowManager): this

  /**
   * Get a registered window manager
   * @param id - Window manager identifier
   */
  getWindowManager: (id: string) => WindowManager | undefined

  /**
   * Open a window by manager id
   * @param id - Window manager identifier
   * @param payload - Window payload
   */
  openWindow: (id: string, payload?: any) => BrowserWindow | null

  /**
   * Start the application
   */
  start(): this

  /**
   * Stop the application and cleanup all plugins
   */
  stop(): Promise<this>

  /**
   * Event emitter methods
   */
  on(event: string, handler: (...args: any[]) => void): this
  once(event: string, handler: (...args: any[]) => void): this
  off(event: string, handler: (...args: any[]) => void): this
  emit: (event: string, ...args: any[]) => boolean
}

/**
 * Electron app configuration
 */
export interface ElectronAppConfig {
  /**
   * App name
   */
  name?: string

  /**
   * Preload scripts directory
   */
  preloadDir?: string

  /**
   * Renderer pages directory
   */
  rendererDir?: string

  /**
   * Development server URL (e.g., VITE_DEV_SERVER_URL)
   */
  devRendererDir?: string

  /**
   * Page loader function
   */
  loadPage?: (win: BrowserWindow, options: { prefix: string, query?: Record<string, any>, rendererDir?: string, devRendererDir?: string }) => void

  /**
   * Default window icon
   */
  icon?: string

  /**
   * Default window width
   */
  width?: number

  /**
   * Default window height
   */
  height?: number

  /**
   * Default window background color
   */
  backgroundColor?: string

  /**
   * Storage adapter for persisting app and window state
   * If not provided, ElectronStoreAdapter will be used by default
   */
  storage?: IStorage
}

/**
 * Window metadata
 */
export interface WindowMeta {
  /**
   * User-provided payload
   */
  payload: any

  /**
   * Page to load
   */
  page?: string

  /**
   * Query parameters
   */
  query?: Record<string, any>

  /**
   * Whether to show window after creation
   */
  show?: boolean

  /**
   * Instance ID for multi-instance managers
   */
  instanceId?: string
}

/**
 * Window context passed to hooks
 */
export interface WindowContext {
  /**
   * Window manager ID
   */
  id: string

  /**
   * App instance
   */
  app?: ElectronApp

  /**
   * User payload
   */
  payload: any

  /**
   * Window metadata
   */
  meta: WindowMeta

  /**
   * Resolved window options
   */
  options: BrowserWindowConstructorOptions

  /**
   * Window manager instance
   */
  manager: WindowManager
}

/**
 * Window lifecycle hooks
 */
export interface WindowHooks {
  /**
   * Called before window creation
   */
  beforeCreate?: (context: WindowContext) => void

  /**
   * Called after window created
   */
  created?: (win: BrowserWindow, context: WindowContext) => void

  /**
   * Called when window is ready to show
   */
  ready?: (win: BrowserWindow, context: WindowContext) => void

  /**
   * Called before showing existing window
   */
  beforeShow?: (win: BrowserWindow, context: WindowContext) => void

  /**
   * Called when window is shown
   */
  shown?: (win: BrowserWindow, context: WindowContext) => void

  /**
   * Called when window is hidden
   */
  hidden?: (win: BrowserWindow, context: WindowContext) => void

  /**
   * Called when window gains focus
   */
  focus?: (win: BrowserWindow, context: WindowContext) => void

  /**
   * Called when window loses focus
   */
  blur?: (win: BrowserWindow, context: WindowContext) => void

  /**
   * Called before window closes
   */
  beforeClose?: (win: BrowserWindow, context: WindowContext) => void

  /**
   * Called after window closed
   */
  closed?: (win: BrowserWindow, context: WindowContext) => void
}

/**
 * Window manager options
 */
export interface WindowManagerOptions {
  /**
   * Parent app instance
   */
  app?: ElectronApp

  /**
   * Whether to allow only one instance
   */
  singleton?: boolean

  /**
   * Window options (static or factory function)
   */
  windowOptions?: BrowserWindowConstructorOptions | ((context: WindowContext) => BrowserWindowConstructorOptions)

  /**
   * Custom window creation function
   */
  create?: (context: WindowContext) => BrowserWindow

  /**
   * Custom window load function
   */
  load?: (win: BrowserWindow, context: WindowContext) => void

  /**
   * Lifecycle hooks
   */
  hooks?: WindowHooks
}

/**
 * Window manager instance
 */
export interface WindowManager {
  /**
   * Window manager ID
   */
  id: string

  /**
   * Whether this is a singleton manager
   */
  singleton: boolean

  /**
   * Create a new window instance
   * @param payload - Window payload
   */
  create: (payload?: any) => BrowserWindow | null

  /**
   * Open a window (reuse existing if singleton)
   * @param payload - Window payload
   */
  open: (payload?: any) => BrowserWindow | null

  /**
   * Close a window
   * @param payload - Window payload or instance ID
   */
  close: (payload?: any) => boolean

  /**
   * Destroy a window
   * @param payload - Window payload or instance ID
   */
  destroy: (payload?: any) => boolean

  /**
   * Get a window instance
   * @param instanceId - Instance ID (optional for singleton)
   */
  get: (instanceId?: string) => BrowserWindow | undefined

  /**
   * Get all window instances
   */
  getAll: () => BrowserWindow[]

  /**
   * Event emitter methods
   */
  on(event: string, handler: (...args: any[]) => void): this
  once(event: string, handler: (...args: any[]) => void): this
  off(event: string, handler: (...args: any[]) => void): this
}

/**
 * Template browser window options
 */
export interface TemplateBrowserWindowOptions extends BrowserWindowConstructorOptions {
  /**
   * Preload directory
   */
  preloadDir?: string

  /**
   * Renderer directory
   */
  rendererDir?: string

  /**
   * Development server URL
   */
  devRendererDir?: string

  /**
   * Whether this is the main window
   */
  main?: boolean

  /**
   * Whether to persist window bounds
   */
  persistenceBounds?: boolean

  /**
   * Custom page loader function
   */
  loadPage?: (win: BrowserWindow, options: { prefix: string, query?: Record<string, any>, rendererDir?: string, devRendererDir?: string }) => void

  /**
   * Storage adapter for window state persistence
   * If not provided, will inherit from app config
   */
  storage?: IStorage
}
