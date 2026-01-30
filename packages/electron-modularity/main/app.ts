import { EventEmitter } from 'node:events'
import { AsyncLocalStorage } from 'node:async_hooks'
import { createContext } from 'unctx'
import type { BrowserWindow } from 'electron'
import { createDefaultStorage } from '../shared/adapters/storage-adapter.js'
import type {
  ElectronApp,
  ElectronAppConfig,
  Plugin,
  PluginPriority,
  PluginState,
} from './types'

/**
 * Priority to numeric value mapping for sorting
 */
const PRIORITY_VALUES: Record<PluginPriority, number> = {
  pre: -50,
  normal: 0,
  post: 50,
}

/**
 * Application context - allows plugins to access app instance via useElectronApp()
 * This uses AsyncLocalStorage for proper async context propagation
 */
const appContext = createContext<ElectronApp>({
  asyncContext: true,
  AsyncLocalStorage,
})

/**
 * Get current electron app instance (unctx-enhanced API)
 * Can be used in plugins instead of relying on the `app` parameter
 *
 * @example
 * ```ts
 * // In plugin
 * export default {
 *   name: 'my-plugin',
 *   apply() {
 *     const app = useElectronApp()
 *     app.provide('key', value)
 *   }
 * }
 * ```
 */
export const useElectronApp = appContext.use

/**
 * Create an Electron application instance with plugin system and dependency injection
 *
 * @param config - App configuration
 * @returns Electron app instance
 *
 * @example
 * ```ts
 * const app = createElectronApp({
 *   name: 'MyApp',
 *   preloadDir: __dirname,
 *   rendererDir: path.join(__dirname, '../dist'),
 * })
 *
 * app.use(myPlugin)
 * app.start()
 * ```
 */
export function createElectronApp(config: ElectronAppConfig = {}): ElectronApp {
  const {
    preloadDir,
    rendererDir,
    devRendererDir,
    name,
    loadPage,
    icon,
    width,
    height,
    backgroundColor,
    storage,
  } = config

  const emitter = new EventEmitter()
  const provides = new Map<string, unknown>()
  const plugins = new Map<string, PluginState>()
  const pending: Array<NormalizedPlugin> = []

  // Internal main window reference
  let mainWindow: BrowserWindow | undefined
  let mainWindowResolver: ((app?: ElectronApp) => Promise<BrowserWindow | undefined>) | undefined

  // Use provided storage or create default instance
  const appStorage = storage || createDefaultStorage()

  const app: ElectronApp = {
    name,
    preloadDir,
    rendererDir,
    devRendererDir,
    loadPage,
    icon,
    width,
    height,
    backgroundColor,
    storage: appStorage,
    provides,
    windows: new Map(),
    pluginStates: plugins,
    _mainWindow: undefined,
    _mainWindowResolver: undefined,

    registerMainWindow(win: BrowserWindow) {
      mainWindow = win
      this._mainWindow = win
      // Emit event to notify waiters that main window is ready
      app.emit('main-window:registered', win)
      return app
    },

    getMainWindow() {
      return mainWindow
    },

    setMainWindowResolver(resolver) {
      mainWindowResolver = resolver
      this._mainWindowResolver = resolver
      return app
    },

    on: (event, handler) => {
      emitter.on(event, handler)
      return app
    },
    once: (event, handler) => {
      emitter.once(event, handler)
      return app
    },
    off: (event, handler) => {
      emitter.off(event, handler)
      return app
    },
    emit: emitter.emit.bind(emitter),

    provide(key, value) {
      provides.set(key, value)
      return app
    },

    inject<T = unknown>(key: string, fallback?: T): T | undefined {
      return provides.has(key) ? (provides.get(key) as T) : fallback
    },

    hasService(key: string): boolean {
      return provides.has(key)
    },

    registerWindowManager(id, manager) {
      if (!id) {
        return app
      }

      app.windows.set(id, manager)
      return app
    },

    getWindowManager(id) {
      return app.windows.get(id)
    },

    openWindow<TPayload = unknown>(id: string, payload?: TPayload): BrowserWindow | null {
      const manager = app.getWindowManager(id)
      const win = manager?.open?.(payload as any)
      // Handle both sync and async window managers
      return win instanceof Promise ? null : (win ?? null)
    },

    use(plugin, options) {
      const normalized = normalizePlugin(plugin, options)

      if (!normalized) {
        return app
      }

      // Check for duplicate plugin names
      if (normalized.name && plugins.has(normalized.name)) {
        console.warn(`⚠️ Plugin "${normalized.name}" already registered!`)
        app.emit('plugin:warning', {
          type: 'duplicate-plugin',
          pluginName: normalized.name,
        })
        return app
      }

      // Check for priority conflicts
      const conflictingPlugin = pending.find(
        p => p.name && p.name === normalized.name && p.priority === normalized.priority,
      )
      if (conflictingPlugin) {
        console.warn(
          `⚠️ Plugin "${normalized.name}" has same name and priority as existing plugin. `
          + `This may cause unexpected behavior.`,
        )
        app.emit('plugin:warning', {
          type: 'priority-conflict',
          pluginName: normalized.name,
          priority: normalized.priority,
        })
      }

      pending.push(normalized as NormalizedPlugin)
      return app
    },

    start() {
      flushPending()
      app.emit('app:started', app)
      return app
    },

    async stop() {
      const installed = Array.from(plugins.values())
      for (let i = installed.length - 1; i >= 0; i -= 1) {
        const state = installed[i]
        try {
          await state.dispose?.()
        }
        catch (error) {
          app.emit('plugin:error', error, state)
        }
      }
      app.emit('app:stopped', app)
      return app
    },
  }

  // Set app as singleton in unctx context
  // This allows useElectronApp() to work anywhere
  appContext.set(app)

  // Default error handler
  app.on<{ error: unknown, state?: { name?: string } }>('plugin:error', (data: unknown) => {
    const payload = data as { error: unknown, state?: { name?: string } }
    console.error(`❌ Plugin error${payload.state?.name ? ` in "${payload.state.name}"` : ''}:`, payload.error || data)
  })

  // Default warning handler
  app.on('plugin:warning', (warning) => {
    console.warn('⚠️ Plugin warning:', warning)
  })

  function flushPending() {
    let changed = true
    let iterations = 0
    const maxIterations = pending.length + 1

    while (changed) {
      changed = false
      iterations++

      // Detect infinite loops (circular dependencies)
      if (iterations > maxIterations) {
        const cyclePlugins = pending.map(p => p.name || '<anonymous>')
        console.error('❌ Circular dependency detected in plugins:', cyclePlugins)
        app.emit('plugin:error', new Error(`Circular dependency detected: ${cyclePlugins.join(', ')}`))
        break
      }

      pending.sort((a, b) => {
        const aValue = PRIORITY_VALUES[a.priority ?? 'normal']
        const bValue = PRIORITY_VALUES[b.priority ?? 'normal']
        return aValue - bValue
      })

      for (let i = 0; i < pending.length; i += 1) {
        const item = pending[i]
        if (!depsSatisfied(item.deps)) {
          continue
        }

        pending.splice(i, 1)
        i -= 1
        installPlugin(item)
        changed = true
      }
    }

    // Warn about unresolved dependencies
    if (pending.length > 0) {
      const unresolved = pending.map(item => ({
        name: item.name,
        missingDeps: item.deps?.filter(dep => !plugins.has(dep)) || [],
      }))
      console.warn('⚠️ Unresolved plugin dependencies:', unresolved)
      app.emit('plugin:warning', {
        type: 'unresolved-dependencies',
        plugins: unresolved,
      })
    }
  }

  function depsSatisfied(deps: string[] = []) {
    if (!deps?.length) {
      return true
    }

    return deps.every(dep => plugins.has(dep))
  }

  function installPlugin(item: NormalizedPlugin) {
    const { name: pluginName, apply, options: pluginOptions } = item
    const api = typeof apply === 'function' ? apply(app, pluginOptions) : undefined

    const dispose = resolveDispose(item, api)

    const state: PluginState = {
      name: pluginName || '',
      api,
      dispose,
      priority: item.priority,
      deps: item.deps,
      plugin: item.raw as Plugin,
    }

    if (pluginName) {
      plugins.set(pluginName, state)
      app.provide(`plugin:${pluginName}`, api ?? true)
    }

    app.emit('plugin:installed', state)
    return state
  }

  return app
}

/**
 * Normalized plugin internal type
 */
interface NormalizedPlugin<TApi = unknown, TOptions = unknown> {
  name: string
  apply: (app: ElectronApp, options?: TOptions) => TApi
  deps: string[]
  priority: PluginPriority
  options?: TOptions
  raw: Plugin<TApi, TOptions> | ((app: ElectronApp, options?: TOptions) => TApi)
  dispose?: () => void | Promise<void>
}

function normalizePlugin<TApi = unknown, TOptions = unknown>(
  plugin: Plugin<TApi, TOptions> | ((app: ElectronApp, options?: TOptions) => TApi),
  options?: TOptions,
): NormalizedPlugin<TApi, TOptions> | null {
  if (!plugin) {
    return null
  }

  if (typeof plugin === 'function') {
    return {
      name: plugin.name || '',
      apply: plugin,
      deps: [],
      priority: 'normal',
      options,
      raw: plugin,
    }
  }

  if (typeof plugin === 'object') {
    const apply = plugin.apply

    if (typeof apply !== 'function') {
      return null
    }

    return {
      name: plugin.name || '',
      apply,
      deps: plugin.deps || [],
      priority: plugin.priority ?? 'normal',
      options: options ?? undefined,
      raw: plugin,
      dispose: plugin.dispose,
    }
  }

  return null
}

function resolveDispose<TApi>(item: NormalizedPlugin<TApi>, api: TApi): (() => void | Promise<void>) | undefined {
  if (typeof item.dispose === 'function') {
    return item.dispose
  }

  if (typeof api === 'function') {
    return api as (() => void | Promise<void>)
  }

  if (api && typeof api === 'object' && 'dispose' in api && typeof (api as any).dispose === 'function') {
    return () => (api as any).dispose()
  }

  if (api && typeof api === 'object' && 'destroy' in api && typeof (api as any).destroy === 'function') {
    return () => (api as any).destroy()
  }

  return undefined
}
