import { EventEmitter } from '$electron/helpers/emitter/index.js'

export function createElectronApp(config = {}) {
  const { preloadDir, rendererDir, name } = config

  const emitter = new EventEmitter()
  const provides = new Map()
  const plugins = new Map()
  const pending = []

  const app = {
    name,
    preloadDir,
    rendererDir,
    provides,
    windows: new Map(),
    pluginStates: plugins,
    on: emitter.on.bind(emitter),
    once: emitter.once.bind(emitter),
    off: emitter.off.bind(emitter),
    emit: emitter.emit.bind(emitter),
  }

  app.provide = (key, value) => {
    provides.set(key, value)
    return app
  }

  app.inject = (key, fallback) => {
    return provides.has(key) ? provides.get(key) : fallback
  }

  app.has = key => provides.has(key)

  app.registerWindowManager = (id, manager) => {
    if (!id) {
      return app
    }

    app.windows.set(id, manager)
    return app
  }

  app.getWindowManager = (id) => {
    return app.windows.get(id)
  }

  app.openWindow = (id, payload) => {
    const manager = app.getWindowManager(id)
    return manager?.open?.(payload)
  }

  app.use = (plugin, options) => {
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
  }

  app.start = () => {
    app.emit('app:started', app)
    return app
  }

  app.stop = async () => {
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
  }

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

  function depsSatisfied(deps = []) {
    if (!deps?.length) {
      return true
    }

    return deps.every(dep => plugins.has(dep))
  }

  function installPlugin(item) {
    const { name: pluginName, apply, options: pluginOptions } = item
    const api = typeof apply === 'function' ? apply(app, pluginOptions) : undefined

    const dispose = resolveDispose(item, api)

    const state = {
      name: pluginName,
      api,
      dispose,
      order: item.order,
      deps: item.deps,
      plugin: item.raw,
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

function normalizePlugin(plugin, options) {
  if (!plugin) {
    return null
  }

  if (typeof plugin === 'function') {
    return {
      name: plugin.name,
      apply: plugin,
      deps: [],
      order: 0,
      options,
      raw: plugin,
    }
  }

  if (typeof plugin === 'object') {
    const apply = plugin.apply || plugin.install || plugin.setup || plugin.use

    if (typeof apply !== 'function') {
      return null
    }

    return {
      name: plugin.name,
      apply,
      deps: plugin.deps || plugin.dependencies || plugin.requires || [],
      order: plugin.order ?? 0,
      options: options ?? plugin.options,
      raw: plugin,
      dispose: plugin.dispose || plugin.destroy || plugin.teardown,
    }
  }

  return null
}

function resolveDispose(item, api) {
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
