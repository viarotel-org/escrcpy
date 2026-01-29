import { EventEmitter } from '$electron/helpers/emitter/index.js'
import { createBrowserWindow } from './template.js'

export function createWindowManager(name, options = {}) {
  if (!name) {
    throw new Error('createWindowManager: name is required')
  }

  const {
    app,
    singleton = false,
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
    const meta = normalizePayload({
      ...rawPayload,
      page: rawPayload.page ?? manager.id,
    })

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

    const existing = meta.instanceId
      ? get(meta.instanceId)
      : (singleton ? get() : undefined)

    if (existing && !existing.isDestroyed?.()) {
      hooks?.beforeShow?.(existing, { app, payload, meta, manager })
      emitter.emit('before-show', existing)
      existing.restore?.()
      existing.show?.()
      existing.focus?.()
      hooks?.shown?.(existing, { app, payload, meta, manager })
      emitter.emit('shown', existing)
      return existing
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
