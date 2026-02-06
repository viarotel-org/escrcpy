import { registry } from './providers/index.js'

/**
 * Terminal Session Manager
 */
class TerminalSessionManager {
  constructor() {
    /**
     * 会话存储
     * @type {Map<string, {provider: import('./providers/base.js').BaseTerminalProvider, type: string, instanceId: string, createdAt: number}>}
     */
    this.sessions = new Map()

    /**
     * 会话创建锁，防止并发创建同一 sessionId
     * @type {Map<string, Promise>}
     */
    this.creatingLocks = new Map()

    /**
     * 自动清理定时器
     * @type {NodeJS.Timeout|null}
     */
    this.cleanupTimer = null

    // 启动自动清理（60秒检查一次，清理超过 60 秒无活动的会话）
    this.startAutoCleanup()
  }

  /**
   * 创建终端会话
   * @param {Object} config
   * @param {string} config.type - 终端类型 ('device' | 'local')
   * @param {string} config.instanceId - 实例 ID
   * @param {Object} config.callbacks - 回调函数
   * @param {Function} config.callbacks.onData - 数据输出回调
   * @param {Function} config.callbacks.onExit - 退出回调
   * @param {Function} config.callbacks.onError - 错误回调
   * @param {Object} config.options - Provider 特定选项
   * @returns {Promise<{sessionId: string}>}
   */
  async create(config) {
    const { type, instanceId, callbacks, options } = config

    if (!type || !instanceId) {
      throw new Error('[SessionManager] type and instanceId are required')
    }

    const sessionId = `${type}:${instanceId}`

    // 检查是否正在创建中（单例锁）
    if (this.creatingLocks.has(sessionId)) {
      console.warn(`[SessionManager] Session is being created, waiting: ${sessionId}`)
      return this.creatingLocks.get(sessionId)
    }

    // 创建会话的 Promise
    const createPromise = (async () => {
      try {
        // 检查会话是否已存在
        const existingSession = this.sessions.get(sessionId)
        if (existingSession) {
          console.warn(`[SessionManager] Session already exists, destroying old session: ${sessionId}`)

          // 验证旧会话状态
          if (existingSession.provider?.isAlive) {
            await this.destroy(sessionId)

            // Windows ConPTY: 延迟 500ms 确保进程完全释放，避免 AttachConsole 失败
            if (process.platform === 'win32' && type === 'local') {
              await new Promise(resolve => setTimeout(resolve, 500))
            }
          }
          else {
            // 死会话直接移除
            this.sessions.delete(sessionId)
          }
        }

        // 获取对应的 Provider 类
        const ProviderClass = registry.get(type)

        // 创建 Provider 实例
        const provider = new ProviderClass({
          instanceId,
          callbacks,
        })

        // 启动终端进程
        await provider.spawn(options)

        // 保存会话信息
        this.sessions.set(sessionId, {
          provider,
          type,
          instanceId,
          createdAt: Date.now(),
          lastActivity: Date.now(),
        })

        console.log(`[SessionManager] Created session: ${sessionId}`)

        return { sessionId }
      }
      finally {
        // 移除创建锁
        this.creatingLocks.delete(sessionId)
      }
    })()

    // 保存创建锁
    this.creatingLocks.set(sessionId, createPromise)

    return createPromise
  }

  /**
   * 获取会话
   * @param {string} sessionId - 会话 ID
   * @returns {Object|null} 会话信息
   */
  get(sessionId) {
    return this.sessions.get(sessionId) || null
  }

  /**
   * 写入数据到会话
   * @param {string} sessionId - 会话 ID
   * @param {string} data - 要写入的数据
   */
  write(sessionId, data) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      console.warn(`[SessionManager] Session not found: ${sessionId}`)
      return
    }

    // 更新活动时间
    session.lastActivity = Date.now()
    session.provider.write(data)
  }

  /**
   * 调整会话终端大小
   * @param {string} sessionId - 会话 ID
   * @param {number} cols - 列数
   * @param {number} rows - 行数
   */
  resize(sessionId, cols, rows) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      console.warn(`[SessionManager] Session not found: ${sessionId}`)
      return
    }

    // 更新活动时间
    session.lastActivity = Date.now()
    session.provider.resize(cols, rows)
  }

  /**
   * 销毁会话
   * @param {string} sessionId - 会话 ID
   * @returns {Promise<void>}
   */
  async destroy(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      console.warn(`[SessionManager] Session not found: ${sessionId}`)
      return
    }

    try {
      await session.provider.destroy()
      this.sessions.delete(sessionId)
      console.log(`[SessionManager] Destroyed session: ${sessionId}`)
    }
    catch (error) {
      console.error(`[SessionManager] Failed to destroy session ${sessionId}:`, error)
      // 即使销毁失败，也移除记录
      this.sessions.delete(sessionId)
    }
  }

  /**
   * 按类型和实例 ID 销毁会话
   * @param {string} type - 终端类型
   * @param {string} instanceId - 实例 ID
   */
  async destroyByTypeAndInstance(type, instanceId) {
    const sessionId = `${type}:${instanceId}`
    await this.destroy(sessionId)
  }

  /**
   * 销毁指定类型的所有会话
   * @param {string} type - 终端类型
   */
  async destroyByType(type) {
    const sessionIds = []
    for (const [sessionId, session] of this.sessions) {
      if (session.type === type) {
        sessionIds.push(sessionId)
      }
    }

    await Promise.all(sessionIds.map(id => this.destroy(id)))
  }

  /**
   * 销毁所有会话
   */
  async destroyAll() {
    const sessionIds = Array.from(this.sessions.keys())
    await Promise.all(sessionIds.map(id => this.destroy(id)))
  }

  /**
   * 获取会话数量
   */
  get size() {
    return this.sessions.size
  }

  /**
   * 获取所有会话 ID
   */
  getSessionIds() {
    return Array.from(this.sessions.keys())
  }

  /**
   * 获取指定类型的会话 ID
   */
  getSessionIdsByType(type) {
    const sessionIds = []
    for (const [sessionId, session] of this.sessions) {
      if (session.type === type) {
        sessionIds.push(sessionId)
      }
    }
    return sessionIds
  }

  /**
   * 启动自动清理机制
   * 每 60 秒检查一次，清理超过 60 秒无活动的会话
   */
  startAutoCleanup() {
    if (this.cleanupTimer) {
      return
    }

    const CLEANUP_INTERVAL = 60 * 1000 // 60 秒
    const SESSION_TIMEOUT = 60 * 1000 // 60 秒

    this.cleanupTimer = setInterval(() => {
      const now = Date.now()
      const toDestroy = []

      for (const [sessionId, session] of this.sessions) {
        // 检查会话是否超时且进程已死亡
        if (session.lastActivity && now - session.lastActivity > SESSION_TIMEOUT) {
          if (!session.provider?.isAlive) {
            toDestroy.push(sessionId)
          }
        }
      }

      if (toDestroy.length > 0) {
        console.log(`[SessionManager] Auto cleanup ${toDestroy.length} inactive sessions`)
        toDestroy.forEach(id => this.destroy(id))
      }
    }, CLEANUP_INTERVAL)
  }

  /**
   * 停止自动清理机制
   */
  stopAutoCleanup() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }
  }
}

// 导出全局单例
export const sessionManager = new TerminalSessionManager()
