import { registry } from './providers/index.js'

class TerminalSessionManager {
  constructor() {
    /**
     * Stores all active sessions
     * @type {Map<string, {provider: import('./providers/base.js').BaseTerminalProvider, type: string, instanceId: string, createdAt: number, lastActivity: number, destroying?: boolean}>}
     */
    this.sessions = new Map()

    /**
     * Tracks sessions currently being created to prevent duplicates
     * @type {Map<string, Promise>}
     */
    this.creatingLocks = new Map()
  }

  /**
   * Create a terminal session
   * @param {Object} config
   * @param {string} config.type - Terminal type ('device' | 'local')
   * @param {string} config.instanceId - Unique instance ID
   * @param {Object} config.callbacks - Callbacks for session events
   * @param {Function} config.callbacks.onData - Called when session outputs data
   * @param {Function} config.callbacks.onExit - Called when session exits
   * @param {Function} config.callbacks.onError - Called on session error
   * @param {Object} config.options - Provider-specific options
   * @returns {Promise<{sessionId: string}>}
   */
  async create(config) {
    const { type, instanceId, callbacks, options } = config
    if (!type || !instanceId) {
      throw new Error('[SessionManager] type and instanceId are required')
    }

    const sessionId = `${type}:${instanceId}`

    // Wait if the session is already being created
    if (this.creatingLocks.has(sessionId)) {
      console.warn(`[SessionManager] Session is being created, waiting: ${sessionId}`)
      return this.creatingLocks.get(sessionId).catch((err) => {
        this.creatingLocks.delete(sessionId)
        throw err
      })
    }

    const createPromise = (async () => {
      try {
        // Destroy existing session if any
        const existingSession = this.sessions.get(sessionId)
        if (existingSession) {
          console.warn(`[SessionManager] Session already exists, destroying old session: ${sessionId}`)
          if (existingSession.provider?.isAlive) {
            await this.destroy(sessionId)
          }
          else {
            this.sessions.delete(sessionId)
          }
        }

        // Create provider instance
        const ProviderClass = registry.get(type)
        if (!ProviderClass) {
          throw new Error(`[SessionManager] No provider registered for type: ${type}`)
        }

        const provider = new ProviderClass({ instanceId, callbacks })
        await provider.spawn(options)

        // Save the session
        this.sessions.set(sessionId, {
          provider,
          type,
          instanceId,
          createdAt: Date.now(),
          lastActivity: Date.now(),
        })

        return { sessionId }
      }
      finally {
        this.creatingLocks.delete(sessionId)
      }
    })()

    this.creatingLocks.set(sessionId, createPromise)
    return createPromise
  }

  /** Get session info by sessionId */
  get(sessionId) {
    return this.sessions.get(sessionId) || null
  }

  /** Write data to a session, returns true if successful */
  write(sessionId, data) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      console.warn(`[SessionManager] Session not found: ${sessionId}`)
      return false
    }
    session.lastActivity = Date.now()
    session.provider.write(data)
    return true
  }

  /** Resize the terminal for a session, returns true if successful */
  resize(sessionId, cols, rows) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      console.warn(`[SessionManager] Session not found: ${sessionId}`)
      return false
    }
    session.lastActivity = Date.now()
    session.provider.resize(cols, rows)
    return true
  }

  /** Destroy a session by sessionId */
  async destroy(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      return
    }

    // Prevent duplicate destruction
    if (session.destroying) {
      return
    }
    session.destroying = true

    try {
      await session.provider.destroy()
    }
    catch (error) {
      console.error(`[SessionManager] Failed to destroy session ${sessionId}:`, error)
    }
    finally {
      this.sessions.delete(sessionId)
    }
  }

  /** Destroy a session by type and instanceId */
  async destroyByTypeAndInstance(type, instanceId) {
    const sessionId = `${type}:${instanceId}`
    await this.destroy(sessionId)
  }

  /** Destroy all sessions of a specific type */
  async destroyByType(type) {
    const sessionIds = this.getSessionIds(session => session.type === type)
    await Promise.all(sessionIds.map(id => this.destroy(id)))
  }

  /** Destroy all active sessions */
  async destroyAll() {
    const sessionIds = Array.from(this.sessions.keys())
    await Promise.all(sessionIds.map(id => this.destroy(id)))
  }

  /** Get the number of active sessions */
  get size() {
    return this.sessions.size
  }

  /**
   * Get session IDs, optionally filtered by a predicate
   * @param {function(session: any): boolean} [filterFn] - Optional filter function
   */
  getSessionIds(filterFn) {
    if (!filterFn) {
      return Array.from(this.sessions.keys())
    }

    return Array.from(this.sessions.entries())
      .filter(([_, session]) => filterFn(session))
      .map(([sessionId]) => sessionId)
  }

  /** Get session IDs filtered by type */
  getSessionIdsByType(type) {
    return this.getSessionIds(session => session.type === type)
  }
}

export const sessionManager = new TerminalSessionManager()
