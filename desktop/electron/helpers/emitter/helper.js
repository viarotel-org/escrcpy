import { EventEmitter } from 'node:events'

/**
 * Internal global symbols (shared across realms)
 */
const kPatched = Symbol.for('EventLimiter.patched')
const kNativeMethods = Symbol.for('EventLimiter.nativeMethods')
const kActiveLimiters = Symbol.for('EventLimiter.activeLimiters')

/**
 * @typedef {string | symbol} EventName
 */

function isValidEventName(event) {
  return typeof event === 'string' || typeof event === 'symbol'
}

/**
 * EventEmitter listener limiter
 */
export class EventLimiter {
  static DEFAULT_OPTIONS = {
    maxListeners: 10,

    /**
     * warnHandler(event, count, max, emitter)
     */
    warnHandler(event, count, max, emitter) {
      const eventName
        = typeof event === 'symbol' ? event.toString() : String(event)

      console.warn(
        `[EventEmitter] Possible memory leak detected. `
        + `${count} "${eventName}" listeners added (max: ${max}).`,
        emitter,
      )
    },

    /**
     * Whether to warn only once per (emitter, event)
     */
    warnOnce: true,

    autoInstall: false,
  }

  constructor(options = {}) {
    this.options = { ...EventLimiter.DEFAULT_OPTIONS, ...options }

    /**
     * WeakMap<EventEmitterLike, Map<EventName, number>>
     * per-instance per-event max
     */
    this.instanceEventMaxMap = new WeakMap()

    /**
     * WeakMap<EventEmitterLike, number>
     * per-instance default max
     */
    this.instanceDefaultMaxMap = new WeakMap()

    /**
     * WeakMap<EventEmitterLike, Set<EventName>>
     * warned events
     */
    this.warnedMap = new WeakMap()

    this._installedTarget = null

    if (this.options.autoInstall) {
      this.install()
    }
  }

  /**
   * Install limiter by patching EventEmitter prototype (once globally)
   */
  install(Target = EventEmitter) {
    const proto = Target?.prototype
    if (!proto) {
      throw new TypeError('Invalid EventEmitter target')
    }

    if (this._installedTarget && this._installedTarget !== Target) {
      throw new Error(
        'EventLimiter instance cannot be installed on multiple targets',
      )
    }

    this._installedTarget = Target

    if (!Target[kActiveLimiters]) {
      Target[kActiveLimiters] = new Set()
    }

    Target[kActiveLimiters].add(this)

    if (Target[kPatched]) {
      return
    }

    Target[kNativeMethods] = {
      on: proto.on,
      addListener: proto.addListener,
      once: proto.once,
      prependListener: proto.prependListener,
      prependOnceListener: proto.prependOnceListener,
      removeListener: proto.removeListener,
      removeAllListeners: proto.removeAllListeners,
    }

    const checkLimit = (emitter, event) => {
      if (
        event === 'newListener'
        || event === 'removeListener'
        || !isValidEventName(event)
      ) {
        return
      }

      const limiters = Target[kActiveLimiters]
      if (!limiters || limiters.size === 0) {
        return
      }

      const count = emitter.listenerCount(event)

      for (const limiter of limiters) {
        const max = limiter.getMaxListeners(emitter, event)

        if (max === 0 || count <= max) {
          continue
        }

        let warnedEvents = limiter.warnedMap.get(emitter)
        if (!warnedEvents) {
          warnedEvents = new Set()
          limiter.warnedMap.set(emitter, warnedEvents)
        }

        if (limiter.options.warnOnce && warnedEvents.has(event)) {
          continue
        }

        warnedEvents.add(event)
        limiter.options.warnHandler(event, count, max, emitter)
      }
    }

    const clearWarnIfNoListeners = (emitter, event) => {
      if (!isValidEventName(event))
        return

      if (emitter.listenerCount(event) === 0) {
        const limiters = Target[kActiveLimiters]
        for (const limiter of limiters) {
          limiter.warnedMap.get(emitter)?.delete(event)
        }
      }
    }

    proto.on = function (event, listener) {
      const ret = Target[kNativeMethods].on.call(this, event, listener)
      checkLimit(this, event)
      return ret
    }

    proto.addListener = function (event, listener) {
      const ret = Target[kNativeMethods].addListener.call(
        this,
        event,
        listener,
      )
      checkLimit(this, event)
      return ret
    }

    proto.once = function (event, listener) {
      const ret = Target[kNativeMethods].once.call(this, event, listener)
      checkLimit(this, event)
      return ret
    }

    proto.prependListener = function (event, listener) {
      const ret = Target[kNativeMethods].prependListener.call(
        this,
        event,
        listener,
      )
      checkLimit(this, event)
      return ret
    }

    proto.prependOnceListener = function (event, listener) {
      const ret = Target[kNativeMethods].prependOnceListener.call(
        this,
        event,
        listener,
      )
      checkLimit(this, event)
      return ret
    }

    proto.removeListener = function (event, listener) {
      const ret = Target[kNativeMethods].removeListener.call(
        this,
        event,
        listener,
      )
      clearWarnIfNoListeners(this, event)
      return ret
    }

    proto.removeAllListeners = function (event) {
      const ret = Target[kNativeMethods].removeAllListeners.call(this, event)

      const limiters = Target[kActiveLimiters]
      for (const limiter of limiters) {
        const warned = limiter.warnedMap.get(this)
        if (!warned)
          continue

        if (event === undefined) {
          warned.clear()
        }
        else if (isValidEventName(event)) {
          warned.delete(event)
        }
      }

      return ret
    }

    Target[kPatched] = true
  }

  /**
   * Uninstall limiter
   */
  uninstall(Target = EventEmitter) {
    const proto = Target?.prototype
    const limiters = Target?.[kActiveLimiters]
    if (!proto || !limiters) {
      return
    }

    limiters.delete(this)

    this.instanceEventMaxMap = new WeakMap()
    this.instanceDefaultMaxMap = new WeakMap()
    this.warnedMap = new WeakMap()
    this._installedTarget = null

    if (limiters.size > 0) {
      return
    }

    Object.assign(proto, Target[kNativeMethods])

    delete Target[kNativeMethods]
    delete Target[kPatched]
    delete Target[kActiveLimiters]
  }

  /**
   * Set max listeners for specific emitter + event
   */
  setMaxListeners(instance, event, max) {
    this.#assertEmitter(instance)

    if (!isValidEventName(event)) {
      throw new TypeError('event must be a string or symbol')
    }

    this.#assertMax(max)

    let map = this.instanceEventMaxMap.get(instance)
    if (!map) {
      map = new Map()
      this.instanceEventMaxMap.set(instance, map)
    }

    map.set(event, max)
  }

  /**
   * Set default max listeners for a specific emitter
   */
  setDefaultMaxListeners(instance, max) {
    this.#assertEmitter(instance)
    this.#assertMax(max)
    this.instanceDefaultMaxMap.set(instance, max)
  }

  /**
   * Get max listeners (priority-based)
   */
  getMaxListeners(instance, event) {
    const eventMap = this.instanceEventMaxMap.get(instance)
    if (eventMap?.has(event)) {
      return eventMap.get(event)
    }

    if (this.instanceDefaultMaxMap.has(instance)) {
      return this.instanceDefaultMaxMap.get(instance)
    }

    if (typeof instance.getMaxListeners === 'function') {
      return instance.getMaxListeners()
    }

    return this.options.maxListeners
  }

  #assertEmitter(instance) {
    if (
      !instance
      || typeof instance.listenerCount !== 'function'
      || typeof instance.on !== 'function'
    ) {
      throw new TypeError('instance must be EventEmitter-like')
    }
  }

  #assertMax(max) {
    if (typeof max !== 'number' || max < 0) {
      throw new TypeError('max must be a non-negative number')
    }
  }
}

/**
 * Default singleton
 */
export const eventLimiter = new EventLimiter({
  warnOnce: false,
})
