import { EventEmitter } from 'node:events'
import { AsyncLocalStorage } from 'node:async_hooks'
import type { BrowserWindow } from 'electron'
import { createContext } from 'unctx'
import type {
  WindowContext,
  WindowManager,
  WindowManagerOptions,
  WindowMeta,
} from './types'

/**
 * Window context - allows hooks to access window context via useWindowContext()
 * This is optional - hooks still receive context as parameter for backward compatibility
 */
const windowContext = createContext<WindowContext>({
  asyncContext: true,
  AsyncLocalStorage,
})

/**
 * Get current window context (unctx-enhanced API)
 * Can be used in window hooks instead of relying on the `context` parameter
 *
 * @example
 * ```ts
 * hooks: {
 *   async created(win) {
 *     const ctx = useWindowContext()
 *     const app = ctx.app
 *     // OR use useElectronApp() directly
 *     const app2 = useElectronApp()
 *   }
 * }
 * ```
 */
export const useWindowContext = windowContext.use

/**
 * Create a window manager for handling window lifecycle
 *
 * @param name - Unique window manager identifier
 * @param options - Window manager options
 * @returns Window manager instance
 *
 * @example
 * ```ts
 * const manager = createWindowManager('main', {
 *   app,
 *   singleton: true,
 *   windowOptions: {
 *     width: 1200,
 *     height: 800,
 *   },
 *   hooks: {
 *     created(win, ctx) {
 *       ctx.app.provide('window:main', win)
 *     }
 *   }
 * })
 * ```
 */
export function createWindowManager(name: string, options: WindowManagerOptions = {}): WindowManager {
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
  const instances = new Map<string, BrowserWindow>()
  let seed = 0

  const manager: WindowManager = {
    id: name,
    singleton,
    create: createWindow as any,
    open: open as any,
    close,
    destroy,
    get,
    getAll,
    on: (event, handler) => {
      emitter.on(event, handler)
      return manager
    },
    once: (event, handler) => {
      emitter.once(event, handler)
      return manager
    },
    off: (event, handler) => {
      emitter.off(event, handler)
      return manager
    },
  }

  // Auto-register to app if provided
  app?.registerWindowManager?.(name, manager)

  return manager

  function resolveOptions(payload: any, meta: WindowMeta) {
    const base: any = typeof windowOptions === 'function'
      ? windowOptions({ id: name, app, payload, meta, manager } as WindowContext)
      : { ...(windowOptions ?? {}) }

    // Inherit from app config if not specified
    if (!base.preloadDir && app?.preloadDir) {
      base.preloadDir = app.preloadDir
    }
    if (!base.rendererDir && app?.rendererDir) {
      base.rendererDir = app.rendererDir
    }
    if (!base.devRendererDir && app?.devRendererDir) {
      base.devRendererDir = app.devRendererDir
    }
    if (!base.loadPage && app?.loadPage) {
      base.loadPage = app.loadPage
    }
    if (!base.icon && app?.icon) {
      base.icon = app.icon
    }
    if (!base.width && app?.width) {
      base.width = app.width
    }
    if (!base.height && app?.height) {
      base.height = app.height
    }
    if (!base.backgroundColor && app?.backgroundColor) {
      base.backgroundColor = app.backgroundColor
    }
    if (!base.storage && app?.storage) {
      base.storage = app.storage
    }

    return base
  }

  async function createWindow(rawPayload: any = {}): Promise<BrowserWindow | null> {
    const meta = normalizePayload({
      ...rawPayload,
      page: rawPayload.page ?? manager.id,
    })

    const payload = meta.payload
    const options = resolveOptions(payload, meta)
    const context: WindowContext = { id: name, app, payload, meta, options, manager }

    // Run in window context (allows hooks to use useWindowContext())
    return await windowContext.callAsync(context, async () => {
      // Before create hooks
      await runHook('beforeCreate', context)
      emitter.emit('before-create', context)

      // Create window
      const win = typeof create === 'function'
        ? create(context)
        : (await import('../shared/template.js')).createBrowserWindow(options)

      if (!win) {
        return null
      }

      // Set metadata
      const instanceId = meta.instanceId ?? `${name}:${Date.now()}-${++seed}`;
      (win as any).__managerId = name;
      (win as any).__instanceId = instanceId

      instances.set(instanceId, win)
      bindWindowEvents(win, context)

      // Load page
      if (typeof load === 'function') {
        load(win, context)
      }
      else if (meta.page && typeof (win as any)?.loadPage === 'function') {
        (win as any).loadPage(meta.page, meta.query)
      }

      // After create hooks
      await runHook('created', win, context)
      emitter.emit('created', win, context)

      // Show if needed
      if (meta.show !== false && typeof win?.show === 'function') {
        win.show()
      }

      return win
    })
  }

  async function open(rawPayload: any = {}): Promise<BrowserWindow | null> {
    const meta = normalizePayload(rawPayload)
    const payload = meta.payload

    const existing = meta.instanceId
      ? get(meta.instanceId)
      : (singleton ? get() : undefined)

    if (existing && !existing.isDestroyed?.()) {
      const context: WindowContext = { id: name, app, payload, meta, options: {}, manager }

      return await windowContext.callAsync(context, async () => {
        await runHook('beforeShow', existing, context)
        emitter.emit('before-show', existing)
        existing.restore?.()
        existing.show?.()
        existing.focus?.()
        await runHook('shown', existing, context)
        emitter.emit('shown', existing)
        return existing
      })
    }

    return createWindow(meta)
  }

  function close(payload: any = {}): boolean {
    const target = resolveTarget(payload)
    if (!target || target.isDestroyed?.()) {
      return false
    }
    target.close?.()
    return true
  }

  function destroy(payload: any = {}): boolean {
    const target = resolveTarget(payload)
    if (!target || target.isDestroyed?.()) {
      return false
    }
    target.destroy?.()
    return true
  }

  function get(instanceId?: string): BrowserWindow | undefined {
    if (!instanceId && singleton) {
      return instances.values().next().value
    }

    if (instanceId) {
      return instances.get(instanceId)
    }

    return undefined
  }

  function getAll(): BrowserWindow[] {
    return Array.from(instances.values())
  }

  function resolveTarget(payload: any): BrowserWindow | undefined {
    if (payload?.instanceId) {
      return instances.get(payload.instanceId)
    }

    if (payload?.win) {
      return payload.win
    }

    return get()
  }

  function bindWindowEvents(win: BrowserWindow, context: WindowContext) {
    win.on?.('ready-to-show', () => {
      windowContext.callAsync(context, async () => {
        await runHook('ready', win, context)
        emitter.emit('ready', win, context)
      })
    })

    win.on?.('show', () => {
      windowContext.callAsync(context, async () => {
        await runHook('shown', win, context)
        emitter.emit('shown', win, context)
      })
    })

    win.on?.('hide', () => {
      windowContext.callAsync(context, async () => {
        await runHook('hidden', win, context)
        emitter.emit('hidden', win, context)
      })
    })

    win.on?.('focus', () => {
      windowContext.callAsync(context, async () => {
        await runHook('focus', win, context)
        emitter.emit('focus', win, context)
      })
    })

    win.on?.('blur', () => {
      windowContext.callAsync(context, async () => {
        await runHook('blur', win, context)
        emitter.emit('blur', win, context)
      })
    })

    win.on?.('close', () => {
      windowContext.callAsync(context, async () => {
        await runHook('beforeClose', win, context)
        emitter.emit('before-close', win, context)
      })
    })

    win.on?.('closed', () => {
      instances.delete((win as any).__instanceId)
      windowContext.callAsync(context, async () => {
        await runHook('closed', win, context)
        emitter.emit('closed', win, context)
      })
    })
  }

  /**
   * Run hook with backward compatibility (pass both win and context as parameters)
   * Also sets up window context for useWindowContext()
   */
  async function runHook(hookName: keyof typeof hooks, ...args: any[]) {
    const hook = hooks[hookName] as any
    if (typeof hook === 'function') {
      await hook(...args)
    }
  }
}

function normalizePayload(payload: any): WindowMeta {
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
