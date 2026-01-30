import type { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import type { IStorage } from '../shared/interfaces'

/**
 * Enhanced BrowserWindow with additional properties and methods
 * @template TExtensions - Additional properties/methods type
 */
export interface EnhancedBrowserWindow<TExtensions = object> extends BrowserWindow {
  /**
   * Access the raw Electron BrowserWindow instance
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
   * @internal
   */
  __managerId?: string

  /**
   * Internal instance ID
   * @internal
   */
  __instanceId?: string

  /**
   * Custom window identifier (dynamically set via loadPage)
   */
  customId?: string
}

/**
 * Enhanced BrowserWindow type with custom extensions
 * Business layer can use this to define their window types:
 * @example
 * type MyWindow = EnhancedBrowserWindow<{ customId: 'main' | 'control' }>
 */
export type ExtendedBrowserWindow<T = object> = EnhancedBrowserWindow<T> & T

/**
 * Main window resolver function type
 * Business layer should provide implementation to resolve main window
 */
export type MainWindowResolver = (app?: ElectronApp) => Promise<BrowserWindow | undefined>

/**
 * Main window provider for plugins
 * Plugins can accept this to get main window without hardcoding
 */
export type MainWindowProvider = () => BrowserWindow | undefined | Promise<BrowserWindow | undefined>

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
  apply: (app: ElectronApp, options?: TOptions) => TApi

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
  order: number
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
   * app.registerMainWindow(mainWindow)
   * ```
   */
  registerMainWindow(win: BrowserWindow): this

  /**
   * Get the registered main window
   * @returns Main window or undefined if not registered
   * @example
   * ```ts
   * const mainWindow = app.getMainWindow()
   * ```
   */
  getMainWindow(): BrowserWindow | undefined

  /**
   * Set a custom main window resolver
   * @param resolver - Custom resolver function
   * @example
   * ```ts
   * app.setMainWindowResolver(async (app) => {
   *   return app.inject('modules:main') as BrowserWindow
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
   * Check if a service exists (backward compatibility alias)
   * @param key - Service key
   * @deprecated Use hasService instead
   */
  has(key: string): boolean

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
 * @template TWindow - Window type (defaults to BrowserWindow for compatibility)
 */
export interface WindowContext<TPayload = unknown, TWindow extends BrowserWindow = BrowserWindow> {
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
  manager: WindowManager<TPayload, TWindow>
}

/**
 * Window lifecycle hooks
 * @template TPayload - Payload type
 * @template TWindow - Window type (defaults to BrowserWindow for compatibility)
 */
export interface WindowHooks<TPayload = unknown, TWindow extends BrowserWindow = BrowserWindow> {
  /**
   * Called before window creation
   */
  beforeCreate?: (context: WindowContext<TPayload, TWindow>) => void | Promise<void>

  /**
   * Called after window created
   */
  created?: (win: TWindow, context: WindowContext<TPayload, TWindow>) => void | Promise<void>

  /**
   * Called when window is ready to show
   */
  ready?: (win: TWindow, context: WindowContext<TPayload, TWindow>) => void | Promise<void>

  /**
   * Called before showing existing window
   */
  beforeShow?: (win: TWindow, context: WindowContext<TPayload, TWindow>) => void | Promise<void>

  /**
   * Called when window is shown
   */
  shown?: (win: TWindow, context: WindowContext<TPayload, TWindow>) => void | Promise<void>

  /**
   * Called when window is hidden
   */
  hidden?: (win: TWindow, context: WindowContext<TPayload, TWindow>) => void | Promise<void>

  /**
   * Called when window gains focus
   */
  focus?: (win: TWindow, context: WindowContext<TPayload, TWindow>) => void | Promise<void>

  /**
   * Called when window loses focus
   */
  blur?: (win: TWindow, context: WindowContext<TPayload, TWindow>) => void | Promise<void>

  /**
   * Called before window closes
   */
  beforeClose?: (win: TWindow, context: WindowContext<TPayload, TWindow>) => void | Promise<void>

  /**
   * Called after window closed
   */
  closed?: (win: TWindow, context: WindowContext<TPayload, TWindow>) => void | Promise<void>
}

/**
 * Window manager options
 * @template TPayload - Payload type
 * @template TWindow - Window type (defaults to BrowserWindow for compatibility)
 */
export interface WindowManagerOptions<TPayload = unknown, TWindow extends BrowserWindow = BrowserWindow> {
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
  windowOptions?: BrowserWindowConstructorOptions | ((context: WindowContext<TPayload, TWindow>) => BrowserWindowConstructorOptions)

  /**
   * Custom window creation function
   */
  create?: (context: WindowContext<TPayload, TWindow>) => TWindow

  /**
   * Custom window load function
   */
  load?: (win: TWindow, context: WindowContext<TPayload, TWindow>) => void

  /**
   * Lifecycle hooks
   */
  hooks?: WindowHooks<TPayload, TWindow>
}

/**
 * Window manager instance
 * @template TPayload - Payload type
 * @template TWindow - Window type (defaults to BrowserWindow for compatibility)
 */
export interface WindowManager<TPayload = unknown, TWindow extends BrowserWindow = BrowserWindow> {
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
  create(payload?: TPayload): Promise<TWindow | null>

  /**
   * Open a window (reuse existing if singleton)
   * @param payload - Window payload
   */
  open(payload?: TPayload): Promise<TWindow | null>

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
   */
  get(instanceId?: string): TWindow | undefined

  /**
   * Get all window instances
   */
  getAll(): TWindow[]

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
