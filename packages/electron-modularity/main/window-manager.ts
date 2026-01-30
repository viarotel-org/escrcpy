import { EventEmitter } from 'node:events'
import { AsyncLocalStorage } from 'node:async_hooks'
import type { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import { createContext } from 'unctx'
import { nanoid } from 'nanoid'
import type {
  EnhancedBrowserWindow,
  WindowContext,
  WindowHooks,
  WindowManager,
  WindowManagerOptions,
  WindowMeta,
} from './types'

/**
 * Window context - allows hooks to access window context via useWindowContext()
 * This is optional - hooks still receive context as parameter for backward compatibility
 */
const windowContext = createContext<WindowContext<any, any>>({
  asyncContext: true,
  AsyncLocalStorage,
})

/**
 * Get current window context (unctx-enhanced API)
 * Can be used in window hooks instead of relying on the `context` parameter
 *
 * @template TPayload - Payload type
 * @template TWindow - Window type
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
export const useWindowContext = windowContext.use as <TPayload = unknown, TWindow extends BrowserWindow = BrowserWindow>() => WindowContext<TPayload, TWindow>

/**
 * Create a window manager for handling window lifecycle
 *
 * @template TPayload - Window payload type
 * @template TWindow - Window type (defaults to BrowserWindow for backward compatibility)
 * @param name - Unique window manager identifier
 * @param options - Window manager options
 * @returns Window manager instance
 *
 * @example
 * ```ts
 * // Without custom window type (backward compatible)
 * const manager = createWindowManager('main', {
 *   app,
 *   singleton: true,
 * })
 *
 * // With custom window type
 * type MyWindow = EnhancedBrowserWindow<{ customId: string }>
 * const manager = createWindowManager<unknown, MyWindow>('control', {
 *   app,
 *   singleton: true,
 *   hooks: {
 *     created(win, ctx) {
 *       console.log(win.customId) // Type-safe!
 *       console.log(win.__instanceId) // Type-safe!
 *       win.loadPage('control') // Type-safe!
 *     }
 *   }
 * })
 * ```
 */
export function createWindowManager<TPayload = unknown, TWindow extends BrowserWindow = BrowserWindow>(
  name: string,
  options: WindowManagerOptions<TPayload, TWindow> = {},
): WindowManager<TPayload, TWindow> {
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
  const instances = new Map<string, TWindow>()

  const manager: WindowManager<TPayload, TWindow> = {
    id: name,
    singleton,
    create: createWindow,
    open,
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

  function resolveOptions(payload: TPayload, meta: WindowMeta<TPayload>): BrowserWindowConstructorOptions {
    const base: any = typeof windowOptions === 'function'
      ? windowOptions({ id: name, app, payload, meta, manager, options: {} } as WindowContext<TPayload, TWindow>)
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

  async function createWindow(rawPayload?: TPayload): Promise<TWindow | null> {
    const meta = normalizePayload({
      ...(rawPayload as any),
      page: (rawPayload as any)?.page ?? manager.id,
    } as TPayload)

    const payload = meta.payload
    const options = resolveOptions(meta.payload, meta)
    const context: WindowContext<TPayload, TWindow> = { id: name, app, payload: meta.payload, meta, options, manager }

    // Run in window context (allows hooks to use useWindowContext())
    return await windowContext.callAsync(context, async () => {
      // Before create hooks
      await runHook('beforeCreate', context)
      emitter.emit('before-create', context)

      // Create window
      const win = typeof create === 'function'
        ? create(context)
        : (await import('../shared/template.js')).createBrowserWindow(options) as unknown as TWindow

      if (!win) {
        return null
      }

      // Set metadata (type-safe via EnhancedBrowserWindow)
      const instanceId = meta.instanceId ?? `${name}:${nanoid(10)}`
      const enhancedWin = win as unknown as EnhancedBrowserWindow
      enhancedWin.__managerId = name
      enhancedWin.__instanceId = instanceId

      instances.set(instanceId, win)
      bindWindowEvents(win, context)

      // Load page
      if (typeof load === 'function') {
        load(win, context)
      }
      else if (meta.page && typeof enhancedWin?.loadPage === 'function') {
        enhancedWin.loadPage(meta.page, meta.query)
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

  async function open(rawPayload?: TPayload): Promise<TWindow | null> {
    const meta = normalizePayload(rawPayload)
    const payload = meta.payload

    const existing = meta.instanceId
      ? get(meta.instanceId)
      : (singleton ? get() : undefined)

    if (existing && !existing.isDestroyed?.()) {
      const context: WindowContext<TPayload, TWindow> = { id: name, app, payload: meta.payload, meta, options: {}, manager }

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

    return createWindow(rawPayload)
  }

  function close(payload?: TPayload | { instanceId?: string }): boolean {
    const target = resolveTarget(payload)
    if (!target || target.isDestroyed?.()) {
      return false
    }
    target.close?.()
    return true
  }

  function destroy(payload?: TPayload | { instanceId?: string }): boolean {
    const target = resolveTarget(payload)
    if (!target || target.isDestroyed?.()) {
      return false
    }
    target.destroy?.()
    return true
  }

  function get(instanceId?: string): TWindow | undefined {
    if (!instanceId && singleton) {
      return instances.values().next().value
    }

    if (instanceId) {
      return instances.get(instanceId)
    }

    return undefined
  }

  function getAll(): TWindow[] {
    return Array.from(instances.values())
  }

  function resolveTarget(payload?: TPayload | { instanceId?: string }): TWindow | undefined {
    if (payload && typeof payload === 'object' && 'instanceId' in payload) {
      return instances.get(payload.instanceId!)
    }

    if (payload && typeof payload === 'object' && 'win' in payload) {
      return (payload as any).win
    }

    return get()
  }

  function bindWindowEvents(win: TWindow, context: WindowContext<TPayload, TWindow>) {
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
      const enhancedWin = win as unknown as EnhancedBrowserWindow
      instances.delete(enhancedWin.__instanceId!)
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
  async function runHook(hookName: keyof WindowHooks<TPayload, TWindow>, ...args: any[]) {
    const hook = hooks[hookName]
    if (typeof hook === 'function') {
      await (hook as any)(...args)
    }
  }
}

function normalizePayload<T>(payload?: T): WindowMeta<T> {
  if (!payload || typeof payload !== 'object') {
    return {
      payload: payload as T,
      page: undefined,
      query: undefined,
      show: true,
      instanceId: undefined,
    }
  }

  const innerPayload = Object.prototype.hasOwnProperty.call(payload, 'payload')
    ? (payload as any).payload
    : payload

  return {
    payload: innerPayload,
    page: (payload as any).page,
    query: (payload as any).query,
    show: (payload as any).show,
    instanceId: (payload as any).instanceId,
  }
}
