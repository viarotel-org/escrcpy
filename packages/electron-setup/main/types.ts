import type { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import type { IStorage } from '../shared/interfaces'

/**
 * Enhanced BrowserWindow with additional properties and methods
 * This is now an interface that TemplateBrowserWindow implements
 * @internal
 */
export interface EnhancedBrowserWindow {
  /**
   * Access the raw Electron BrowserWindow instance
   * All native BrowserWindow methods must be accessed via this property
   */
  readonly raw: BrowserWindow

  /**
   * Load a page by path with optional query parameters
   * @param pagePath - Page path (e.g., 'main', 'settings')
   * @param query - URL query parameters
   */
  loadPage(pagePath?: string, query?: Record<string, any>): void

  /**
   * Internal window manager ID
   * Set by window manager when creating the window
   * @internal
   */
  managerId?: string

  /**
   * Internal instance ID
   * Set by window manager when creating the window
   * @internal
   */
  instanceId?: string
}

/**
 * Main window resolver function type
 * Business layer should provide implementation to resolve main window
 */
export type MainWindowResolver = (mainApp?: ElectronApp) => Promise<BrowserWindow | undefined>

/**
 * Main window provider for plugins
 * Plugins can accept this to get main window without hardcoding
 */
export type MainWindowProvider = () => BrowserWindow | undefined | Promise<BrowserWindow | undefined>

/**
 * Plugin priority levels
 * Determines the load order of plugins
 */
export type PluginPriority = 'pre' | 'normal' | 'post'

/**
 * Plugin interface for Electron app
 * @template TApi - The API type returned by the plugin
 * @template TOptions - The options type accepted by the plugin
 */
export interface Plugin<TApi = unknown, TOptions = unknown> {
  /**
   * Unique plugin name (used for dependency resolution and service injection)
   */
  name?: string

  /**
   * Plugin load priority
   * - pre: Loads first (e.g., sandbox, singleton, theme)
   * - normal: Default priority (e.g., clipboard, IPC handlers)
   * - post: Loads last
   * @default 'normal'
   */
  priority?: PluginPriority

  /**
   * Plugin dependencies (other plugin names)
   */
  deps?: string[]

  /**
   * Plugin installation function
   * @param mainApp - The Electron mainApp instance
   * @param options - Plugin options
   * @returns Plugin API or cleanup function
   */
  apply: (mainApp: ElectronApp, options?: TOptions) => TApi

  /**
   * Cleanup function called when app stops
   */
  dispose?: () => void | Promise<void>
}

/**
 * Plugin state tracking
 * @template TApi - The API type returned by the plugin
 */
export interface PluginState<TApi = unknown> {
  name: string
  api: TApi
  dispose?: () => void | Promise<void>
  priority: PluginPriority
  deps: string[]
  plugin: Plugin<TApi>
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
  provides: Map<string, unknown>

  /**
   * Registered window managers
   */
  windows: Map<string, WindowManager>

  /**
   * Plugin states
   */
  pluginStates: Map<string, PluginState>

  /**
   * Internal main window reference (set via registerMainWindow)
   * @internal
   */
  _mainWindow?: BrowserWindow

  /**
   * Custom main window resolver (set via setMainWindowResolver)
   * @internal
   */
  _mainWindowResolver?: MainWindowResolver

  /**
   * Register the main window for easy access
   * @param win - Main window instance
   * @example
   * ```ts
   * const mainWindow = await manager.open()
   * mainApp.registerMainWindow(mainWindow)
   * ```
   */
  registerMainWindow(win: BrowserWindow): this

  /**
   * Get the registered main window
   * @returns Main window or undefined if not registered
   * @example
   * ```ts
   * const mainWindow = mainApp.getMainWindow()
   * ```
   */
  getMainWindow(): BrowserWindow | undefined

  /**
   * Set a custom main window resolver
   * @param resolver - Custom resolver function
   * @example
   * ```ts
   * mainApp.setMainWindowResolver(async (mainApp) => {
   *   return mainApp.inject('modules:main') as BrowserWindow
   * })
   * ```
   */
  setMainWindowResolver(resolver: MainWindowResolver): this

  /**
   * Inject a service or value
   * @param key - Service key
   * @param value - Service value
   */
  provide<T>(key: string, value: T): this

  /**
   * Retrieve an injected service or value
   * @template T - Expected service type
   * @param key - Service key
   * @param fallback - Fallback value if key not found
   */
  inject<T = unknown>(key: string, fallback?: T): T | undefined

  /**
   * Check if a service exists
   * @param key - Service key
   */
  hasService(key: string): boolean

  /**
   * Register a plugin
   * @template TApi - Plugin API type
   * @template TOptions - Plugin options type
   * @param plugin - Plugin to register
   * @param options - Plugin options
   */
  use<TApi = unknown, TOptions = unknown>(
    plugin: Plugin<TApi, TOptions> | ((app: ElectronApp, options?: TOptions) => TApi),
    options?: TOptions
  ): this

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
  getWindowManager(id: string): WindowManager | undefined

  /**
   * Open a window by manager id
   * @template TPayload - Window payload type
   * @param id - Window manager identifier
   * @param payload - Window payload
   */
  openWindow<TPayload = unknown>(id: string, payload?: TPayload): BrowserWindow | null

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
  on<TEventData = unknown>(event: string, handler: (data: TEventData, ...args: unknown[]) => void): this
  once<TEventData = unknown>(event: string, handler: (data: TEventData, ...args: unknown[]) => void): this
  off<TEventData = unknown>(event: string, handler: (data: TEventData, ...args: unknown[]) => void): this
  emit(event: string, ...args: unknown[]): boolean
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
 * @template TPayload - User-provided payload type
 */
export interface WindowMeta<TPayload = unknown> {
  /**
   * User-provided payload
   */
  payload: TPayload

  /**
   * Page to load
   */
  page?: string

  /**
   * Query parameters
   */
  query?: Record<string, unknown>

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
 * @template TPayload - Payload type
 */
export interface WindowContext<TPayload = unknown> {
  /**
   * Window manager ID
   */
  id: string

  /**
   * App instance
   */
  mainApp?: ElectronApp

  /**
   * User payload
   */
  payload: TPayload

  /**
   * Window metadata
   */
  meta: WindowMeta<TPayload>

  /**
   * Resolved window options
   */
  options: BrowserWindowConstructorOptions

  /**
   * Window manager instance
   */
  manager: WindowManager<TPayload>
}

/**
 * Window lifecycle hooks
 * Business code receives native BrowserWindow instances
 * @template TPayload - Payload type
 */
export interface WindowHooks<TPayload = unknown> {
  /**
   * Called before window creation
   */
  beforeCreate?: (context: WindowContext<TPayload>) => void | Promise<void>

  /**
   * Called after window created
   * @param win - Native BrowserWindow instance
   */
  created?: (win: BrowserWindow, context: WindowContext<TPayload>) => void | Promise<void>

  /**
   * Called when window is ready to show
   * @param win - Native BrowserWindow instance
   */
  ready?: (win: BrowserWindow, context: WindowContext<TPayload>) => void | Promise<void>

  /**
   * Called before showing existing window
   * @param win - Native BrowserWindow instance
   */
  beforeShow?: (win: BrowserWindow, context: WindowContext<TPayload>) => void | Promise<void>

  /**
   * Called when window is shown
   * @param win - Native BrowserWindow instance
   */
  shown?: (win: BrowserWindow, context: WindowContext<TPayload>) => void | Promise<void>

  /**
   * Called when window is hidden
   * @param win - Native BrowserWindow instance
   */
  hidden?: (win: BrowserWindow, context: WindowContext<TPayload>) => void | Promise<void>

  /**
   * Called when window gains focus
   * @param win - Native BrowserWindow instance
   */
  focus?: (win: BrowserWindow, context: WindowContext<TPayload>) => void | Promise<void>

  /**
   * Called when window loses focus
   * @param win - Native BrowserWindow instance
   */
  blur?: (win: BrowserWindow, context: WindowContext<TPayload>) => void | Promise<void>

  /**
   * Called before window closes
   * @param win - Native BrowserWindow instance
   */
  beforeClose?: (win: BrowserWindow, context: WindowContext<TPayload>) => void | Promise<void>

  /**
   * Called after window closed
   * @param win - Native BrowserWindow instance
   */
  closed?: (win: BrowserWindow, context: WindowContext<TPayload>) => void | Promise<void>
}

/**
 * Window manager options
 * @template TPayload - Payload type
 */
export interface WindowManagerOptions<TPayload = unknown> {
  /**
   * Whether to allow only one instance
   */
  singleton?: boolean

  /**
   * Mark this window as the main window
   * When true, automatically:
   * - Sets browserWindow.main = true (affects loadPage prefix)
   * - Registers window via mainApp.registerMainWindow() in created hook
   * @default false
   */
  mainWindow?: boolean

  /**
   * BrowserWindow configuration options (static or factory function)
   * Can be a static config object or a factory function that receives window context
   * @example
   * // Static configuration
   * browserWindow: { width: 800, height: 600 }
   *
   * @example
   * // Dynamic configuration
   * browserWindow: (context) => ({
   *   width: context.payload.width || 800,
   *   height: context.payload.height || 600
   * })
   */
  browserWindow?: BrowserWindowConstructorOptions | ((context: WindowContext<TPayload>) => BrowserWindowConstructorOptions)

  /**
   * Custom window creation function (for internal use)
   * @internal
   */
  create?: (context: WindowContext<TPayload>) => any

  /**
   * Custom window load function (for internal use)
   * @internal
   */
  load?: (win: any, context: WindowContext<TPayload>) => void

  /**
   * Lifecycle hooks
   */
  hooks?: WindowHooks<TPayload>
}

/**
 * Window manager instance
 * All methods return native BrowserWindow instances
 * @template TPayload - Payload type
 */
export interface WindowManager<TPayload = unknown> {
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
   * @returns Native BrowserWindow instance
   */
  create(payload?: TPayload): Promise<BrowserWindow | null>

  /**
   * Open a window (reuse existing if singleton)
   * @param payload - Window payload
   * @returns Native BrowserWindow instance
   */
  open(payload?: TPayload): Promise<BrowserWindow | null>

  /**
   * Close a window
   * @param payload - Window payload or instance ID
   */
  close(payload?: TPayload | { instanceId?: string }): boolean

  /**
   * Destroy a window
   * @param payload - Window payload or instance ID
   */
  destroy(payload?: TPayload | { instanceId?: string }): boolean

  /**
   * Get a window instance
   * @param instanceId - Instance ID (optional for singleton)
   * @returns Native BrowserWindow instance
   */
  get(instanceId?: string): BrowserWindow | undefined

  /**
   * Get all window instances
   * @returns Array of native BrowserWindow instances
   */
  getAll(): BrowserWindow[]

  /**
   * Event emitter methods
   */
  on<TEventData = unknown>(event: string, handler: (data: TEventData, ...args: unknown[]) => void): this
  once<TEventData = unknown>(event: string, handler: (data: TEventData, ...args: unknown[]) => void): this
  off<TEventData = unknown>(event: string, handler: (data: TEventData, ...args: unknown[]) => void): this
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
  mainWindow?: boolean

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
