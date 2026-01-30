import { EventEmitter } from 'node:events'
import { AsyncLocalStorage } from 'node:async_hooks'
import type { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import { createContext } from 'unctx'
import { nanoid } from 'nanoid'
import type {
  WindowContext,
  WindowHooks,
  WindowManager,
  WindowManagerOptions,
  WindowMeta,
} from './types'
import type { TemplateBrowserWindow } from '../shared/template.js'
import { useElectronApp } from './app.js'

/**
 * Window context - allows hooks to access window context via useWindowContext()
 * This is optional - hooks still receive context as parameter for backward compatibility
 */
const windowContext = createContext<WindowContext<unknown>>({
  asyncContext: true,
  AsyncLocalStorage,
})

/**
 * Get current window context
 * Can be used in window hooks instead of relying on the `context` parameter
 *
 * @template TPayload - Payload type
 * @example
 * ```ts
 * hooks: {
 *   async created(win) {
 *     const windowContext = useWindowContext()
 *     const mainApp = windowContext.mainApp
 *     // OR use useElectronApp() directly
 *     const mainApp2 = useElectronApp()
 *   }
 * }
 * ```
 */
export const useWindowContext = windowContext.use as <TPayload = unknown>() => WindowContext<TPayload>

/**
 * Create a window manager for handling window lifecycle
 *
 * @template TPayload - Window payload type
 * @param name - Unique window manager identifier
 * @param options - Window manager options
 * @returns Window manager instance
 *
 * @example
 * ```ts
 * // Basic usage
 * const manager = createWindowManager('main', {
 *   app,
 *   singleton: true,
 * })
 *
 * // With hooks receiving native BrowserWindow
 * const manager = createWindowManager('control', {
 *   app,
 *   singleton: true,
 *   hooks: {
 *     created(win, mainApp) {
 *       // win is native BrowserWindow
 *       win.webContents.send('ready')
 *       win.show()
 *     }
 *   }
 * })
 * ```
 */
export function createWindowManager<TPayload = unknown>(
  name: string,
  options: WindowManagerOptions<TPayload> = {},
): WindowManager<TPayload> {
  if (!name) {
    throw new Error('createWindowManager: name is required')
  }

  const {
    singleton = false,
    mainWindow = false,
    browserWindow,
    create,
    load,
    hooks = {},
  } = options

  const mainApp = useElectronApp()

  // Internal: store TemplateBrowserWindow instances
  const instances = new Map<string, TemplateBrowserWindow>()

  // Wrap hooks to auto-register main window
  const wrappedHooks = { ...hooks }
  if (mainWindow && mainApp?.registerMainWindow) {
    const originalCreated = hooks.created
    wrappedHooks.created = async (win: BrowserWindow, context: WindowContext<TPayload>) => {
      // Auto-register as main window
      mainApp.registerMainWindow(win)
      // Call original hook if exists
      if (originalCreated) {
        await originalCreated(win, context)
      }
    }
  }

  const emitter = new EventEmitter()

  const manager: WindowManager<TPayload> = {
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
  mainApp?.registerWindowManager?.(name, manager)

  return manager

  function resolveOptions(payload: TPayload, meta: WindowMeta<TPayload>): BrowserWindowConstructorOptions {
    const base: any = typeof browserWindow === 'function'
      ? browserWindow({ id: name, mainApp, payload, meta, manager, options: {} } as WindowContext<TPayload>)
      : { ...(browserWindow ?? {}) }

    // Auto-set main flag if mainWindow option is true
    if (mainWindow && base.mainWindow === undefined) {
      base.mainWindow = true
    }

    // Inherit from app config if not specified
    if (!base.preloadDir && mainApp?.preloadDir) {
      base.preloadDir = mainApp.preloadDir
    }
    if (!base.rendererDir && mainApp?.rendererDir) {
      base.rendererDir = mainApp.rendererDir
    }
    if (!base.devRendererDir && mainApp?.devRendererDir) {
      base.devRendererDir = mainApp.devRendererDir
    }
    if (!base.loadPage && mainApp?.loadPage) {
      base.loadPage = mainApp.loadPage
    }
    if (!base.icon && mainApp?.icon) {
      base.icon = mainApp.icon
    }
    if (!base.width && mainApp?.width) {
      base.width = mainApp.width
    }
    if (!base.height && mainApp?.height) {
      base.height = mainApp.height
    }
    if (!base.backgroundColor && mainApp?.backgroundColor) {
      base.backgroundColor = mainApp.backgroundColor
    }
    if (!base.storage && mainApp?.storage) {
      base.storage = mainApp.storage
    }

    return base
  }

  async function createWindow(rawPayload?: TPayload): Promise<BrowserWindow | null> {
    const meta = normalizePayload({
      ...(rawPayload as any),
      page: (rawPayload as any)?.page ?? manager.id,
    } as TPayload)

    const payload = meta.payload
    const options = resolveOptions(meta.payload, meta)
    const context: WindowContext<TPayload> = { id: name, mainApp, payload: meta.payload, meta, options, manager }

    // Run in window context (allows hooks to use useWindowContext())
    return await windowContext.callAsync(context, async () => {
      // Before create hooks
      await runHook('beforeCreate', context)
      emitter.emit('before-create', context)

      // Create window (internal TemplateBrowserWindow)
      const internalWin = typeof create === 'function'
        ? create(context)
        : (await import('../shared/template.js')).createBrowserWindow(options)

      if (!internalWin) {
        return null
      }

      // Set metadata on TemplateBrowserWindow instance
      const instanceId = meta.instanceId ?? `${name}:${nanoid(10)}`
      internalWin.managerId = name
      internalWin.instanceId = instanceId

      instances.set(instanceId, internalWin)
      bindWindowEvents(internalWin, context)

      // Load page
      if (typeof load === 'function') {
        load(internalWin, context)
      }
      else if (meta.page && typeof internalWin?.loadPage === 'function') {
        internalWin.loadPage(meta.page, meta.query)
      }

      // After create hooks (pass raw BrowserWindow to business layer)
      await runHook('created', internalWin.raw, context)
      emitter.emit('created', internalWin.raw, context)

      // Show if needed
      if (meta.show !== false && typeof internalWin.raw?.show === 'function') {
        internalWin.raw.show()
      }

      // Return raw BrowserWindow to business layer
      return internalWin.raw
    })
  }

  async function open(rawPayload?: TPayload): Promise<BrowserWindow | null> {
    const meta = normalizePayload(rawPayload)
    const payload = meta.payload

    // Internal: get TemplateBrowserWindow
    const internalExisting = meta.instanceId
      ? instances.get(meta.instanceId)
      : (singleton ? instances.values().next().value : undefined)

    if (internalExisting && !internalExisting.raw.isDestroyed?.()) {
      const context: WindowContext<TPayload> = { id: name, mainApp, payload: meta.payload, meta, options: {}, manager }

      return await windowContext.callAsync(context, async () => {
        await runHook('beforeShow', internalExisting.raw, context)
        emitter.emit('before-show', internalExisting.raw)
        internalExisting.raw.restore?.()
        internalExisting.raw.show?.()
        internalExisting.raw.focus?.()
        await runHook('shown', internalExisting.raw, context)
        emitter.emit('shown', internalExisting.raw)
        // Return raw BrowserWindow
        return internalExisting.raw
      })
    }

    return createWindow(rawPayload)
  }

  function close(payload?: TPayload & {}): boolean {
    const target = resolveTarget(payload)
    if (!target || target.isDestroyed?.()) {
      return false
    }
    target.close?.()
    return true
  }

  function destroy(payload?: TPayload & {}): boolean {
    const target = resolveTarget(payload)
    if (!target || target.isDestroyed?.()) {
      return false
    }
    target.destroy?.()
    return true
  }

  function get(instanceId?: string): BrowserWindow | undefined {
    let internalWin: TemplateBrowserWindow | undefined

    if (!instanceId && singleton) {
      internalWin = instances.values().next().value
    }
    else if (instanceId) {
      internalWin = instances.get(instanceId)
    }

    // Return raw BrowserWindow
    return internalWin?.raw
  }

  function getAll(): BrowserWindow[] {
    // Return array of raw BrowserWindow instances
    return Array.from(instances.values()).map(win => win.raw)
  }

  function resolveTarget(payload?: TPayload & { instanceId?: string, win?: BrowserWindow }): BrowserWindow | undefined {
    let internalWin: TemplateBrowserWindow | undefined

    if (singleton) {
      internalWin = instances.values().next().value
    }
    else if (payload?.instanceId) {
      internalWin = instances.get(payload.instanceId!)
    }
    else if (payload?.win) {
      return payload.win
    }

    return internalWin?.raw
  }

  function bindWindowEvents(internalWin: TemplateBrowserWindow, context: WindowContext<TPayload>) {
    internalWin.raw.on?.('ready-to-show', () => {
      windowContext.callAsync(context, async () => {
        await runHook('ready', internalWin.raw, context)
        emitter.emit('ready', internalWin.raw, context)
      })
    })

    internalWin.raw.on?.('show', () => {
      windowContext.callAsync(context, async () => {
        await runHook('shown', internalWin.raw, context)
        emitter.emit('shown', internalWin.raw, context)
      })
    })

    internalWin.raw.on?.('hide', () => {
      windowContext.callAsync(context, async () => {
        await runHook('hidden', internalWin.raw, context)
        emitter.emit('hidden', internalWin.raw, context)
      })
    })

    internalWin.raw.on?.('focus', () => {
      windowContext.callAsync(context, async () => {
        await runHook('focus', internalWin.raw, context)
        emitter.emit('focus', internalWin.raw, context)
      })
    })

    internalWin.raw.on?.('blur', () => {
      windowContext.callAsync(context, async () => {
        await runHook('blur', internalWin.raw, context)
        emitter.emit('blur', internalWin.raw, context)
      })
    })

    internalWin.raw.on?.('close', () => {
      windowContext.callAsync(context, async () => {
        await runHook('beforeClose', internalWin.raw, context)
        emitter.emit('before-close', internalWin.raw, context)
      })
    })

    internalWin.raw.on?.('closed', () => {
      instances.delete(internalWin.instanceId!)
      windowContext.callAsync(context, async () => {
        await runHook('closed', internalWin.raw, context)
        emitter.emit('closed', internalWin.raw, context)
      })
    })
  }

  /**
   * Run hook with backward compatibility (pass both win and context as parameters)
   * Also sets up window context for useWindowContext()
   */
  async function runHook(hookName: keyof WindowHooks<TPayload>, ...args: any[]) {
    const hook = wrappedHooks[hookName]
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
