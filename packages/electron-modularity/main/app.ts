import { EventEmitter } from 'node:events'
import { AsyncLocalStorage } from 'node:async_hooks'
import { createContext } from 'unctx'
import { createDefaultStorage } from '../shared/adapters/storage-adapter.js'
import type {
  ElectronApp,
  ElectronAppConfig,
  Plugin,
  PluginState,
} from './types'

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
  const provides = new Map<string, any>()
  const plugins = new Map<string, PluginState>()
  const pending: Array<NormalizedPlugin> = []

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

    inject(key, fallback) {
      return provides.has(key) ? provides.get(key) : fallback
    },

    has(key) {
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

    openWindow(id, payload) {
      const manager = app.getWindowManager(id)
      return manager?.open?.(payload) ?? null
    },

    use(plugin, options) {
      const normalized = normalizePlugin(plugin, options)

      if (!normalized) {
        return app
      }

      if (normalized.name && plugins.has(normalized.name)) {
        console.warn(`⚠️ Plugin "${normalized.name}" already registered!`)
        return app
      }

      pending.push(normalized)
      flushPending()

      return app
    },

    start() {
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

  function flushPending() {
    let changed = true

    while (changed) {
      changed = false

      pending.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

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
      order: item.order,
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
interface NormalizedPlugin {
  name: string
  apply: (app: ElectronApp, options?: any) => any
  deps: string[]
  order: number
  options?: any
  raw: Plugin | ((app: ElectronApp, options?: any) => any)
  dispose?: () => void | Promise<void>
}

function normalizePlugin(
  plugin: Plugin | ((app: ElectronApp, options?: any) => any),
  options?: any,
): NormalizedPlugin | null {
  if (!plugin) {
    return null
  }

  if (typeof plugin === 'function') {
    return {
      name: plugin.name || '',
      apply: plugin,
      deps: [],
      order: 0,
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
      order: plugin.order ?? 0,
      options: options ?? undefined,
      raw: plugin,
      dispose: plugin.dispose,
    }
  }

  return null
}

function resolveDispose(item: NormalizedPlugin, api: any): (() => void | Promise<void>) | undefined {
  if (typeof item.dispose === 'function') {
    return item.dispose
  }

  if (typeof api === 'function') {
    return api
  }

  if (api && typeof api.dispose === 'function') {
    return () => api.dispose()
  }

  if (api && typeof api.destroy === 'function') {
    return () => api.destroy()
  }

  return undefined
}
