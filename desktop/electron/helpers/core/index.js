import { EventEmitter } from 'node:events'
import { createBrowserWindow } from '../window/index.js'

export function createElectronApp(config = {}) {
  const { preloadDir, name } = config

  const emitter = new EventEmitter()
  const provides = new Map()
  const plugins = new Map()
  const pending = []

  const app = {
    name,
    preloadDir,
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
      return app
    }

    pending.push(normalized)
    flushPending()

    return app
  }

  app.start = () => {
    flushPending()
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

/**
 *  1. 需要支持自动创建在可以在渲染进程打开/关闭/销毁窗口的功能
 *  2. 整合并管理其整个生命周期
 *  3. 支持单例和多例模式
 *  4. 支持向外暴露生命周期
 */
export function createWindowManager(name, options = {}) {
  if (!name) {
    throw new Error('createWindowManager: name is required')
  }

  const {
    app,
    singleton = true,
    windowOptions,
    create,
    load,
    hooks = {},
  } = options

  const emitter = new EventEmitter()
  const instances = new Map()
  let seed = 0

  const manager = {
    id: name,
    singleton,
    create: createWindow,
    open,
    close,
    destroy,
    get,
    getAll,
    on: emitter.on.bind(emitter),
    once: emitter.once.bind(emitter),
    off: emitter.off.bind(emitter),
  }

  app?.registerWindowManager?.(name, manager)

  return manager

  function resolveOptions(payload, meta) {
    const base = typeof windowOptions === 'function'
      ? windowOptions({ app, payload, meta, manager })
      : { ...(windowOptions ?? {}) }

    if (!base.preloadDir && app?.preloadDir) {
      base.preloadDir = app.preloadDir
    }

    return base
  }

  function createWindow(rawPayload = {}) {
    const meta = normalizePayload(rawPayload)
    const payload = meta.payload

    hooks?.beforeCreate?.({ app, payload, meta, manager })
    emitter.emit('before-create', { app, payload, meta, manager })

    const options = resolveOptions(payload, meta)
    const context = { id: name, app, payload, meta, options, manager }

    const win = typeof create === 'function'
      ? create(context)
      : createBrowserWindow(options)

    if (!win) {
      return null
    }

    const instanceId = meta.instanceId ?? `${name}:${Date.now()}-${++seed}`
    win.__managerId = name
    win.__instanceId = instanceId

    instances.set(instanceId, win)
    bindWindowEvents(win, context)

    if (typeof load === 'function') {
      load(win, context)
    }
    else if (meta.page && typeof win?.loadPage === 'function') {
      win.loadPage(meta.page, meta.query)
    }

    hooks?.created?.(win, context)
    emitter.emit('created', win, context)

    if (meta.show !== false && typeof win?.show === 'function') {
      win.show()
    }

    return win
  }

  function open(rawPayload = {}) {
    const meta = normalizePayload(rawPayload)
    const payload = meta.payload

    if (singleton) {
      const existing = get()
      if (existing && !existing.isDestroyed?.()) {
        hooks?.beforeShow?.(existing, { app, payload, meta, manager })
        emitter.emit('before-show', existing)
        existing.show?.()
        existing.focus?.()
        hooks?.shown?.(existing, { app, payload, meta, manager })
        emitter.emit('shown', existing)
        return existing
      }
    }

    return createWindow(meta)
  }

  function close(payload = {}) {
    const target = resolveTarget(payload)
    if (!target || target.isDestroyed?.()) {
      return false
    }
    target.close?.()
    return true
  }

  function destroy(payload = {}) {
    const target = resolveTarget(payload)
    if (!target || target.isDestroyed?.()) {
      return false
    }
    target.destroy?.()
    return true
  }

  function get(instanceId) {
    if (!instanceId && singleton) {
      return instances.values().next().value
    }

    if (instanceId) {
      return instances.get(instanceId)
    }

    return undefined
  }

  function getAll() {
    return Array.from(instances.values())
  }

  function resolveTarget(payload) {
    if (payload?.instanceId) {
      return instances.get(payload.instanceId)
    }

    if (payload?.win) {
      return payload.win
    }

    return get()
  }

  function bindWindowEvents(win, context) {
    win.on?.('ready-to-show', () => {
      hooks?.ready?.(win, context)
      emitter.emit('ready', win, context)
    })

    win.on?.('show', () => {
      hooks?.shown?.(win, context)
      emitter.emit('shown', win, context)
    })

    win.on?.('hide', () => {
      hooks?.hidden?.(win, context)
      emitter.emit('hidden', win, context)
    })

    win.on?.('focus', () => {
      hooks?.focus?.(win, context)
      emitter.emit('focus', win, context)
    })

    win.on?.('blur', () => {
      hooks?.blur?.(win, context)
      emitter.emit('blur', win, context)
    })

    win.on?.('close', () => {
      hooks?.beforeClose?.(win, context)
      emitter.emit('before-close', win, context)
    })

    win.on?.('closed', () => {
      instances.delete(win.__instanceId)
      hooks?.closed?.(win, context)
      emitter.emit('closed', win, context)
    })
  }
}

function normalizePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return {
      payload,
      page: undefined,
      query: undefined,
      show: true,
      instanceId: undefined,
    }
  }

  const innerPayload = Object.prototype.hasOwnProperty.call(payload, 'payload')
    ? payload.payload
    : payload

  return {
    payload: innerPayload,
    page: payload.page,
    query: payload.query,
    show: payload.show,
    instanceId: payload.instanceId,
  }
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
