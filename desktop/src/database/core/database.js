/**
 * Core database instance - Dexie.js wrapper for IndexedDB
 *
 * Design:
 * 1. Singleton ensures a single global DB instance
 * 2. Modular schema design to extend modules on demand
 * 3. Versioning supports smooth upgrades
 *
 * @module storage/core/database
 */

import Dexie from 'dexie'

// Database namease name
const DB_NAME = 'escrcpy_local_db'

// Current database version
const DB_VERSION = 1

/**
 * Module schema configuration
 * Each module defines its own table structures and indexes
 * Index rules: ++ auto-increment primary key, & unique index, * multi-entry index, [a+b] composite index
 */
const MODULE_SCHEMAS = {
  /**
   * Chat messages module
   * - id: Unique message identifier (auto-increment)
   * - sessionId: Session ID to separate chats by device/session
   * - timestamp: Message timestamp (supports range queries)
   * - role: Message role (user/assistant/system)
   */
  chat: {
    messages: '++id, sessionId, timestamp, role, [sessionId+timestamp]',
  },

  /**
   * Task module (reserved)
   * - id: Unique task identifier
   * - deviceId: Device ID
   * - status: Task status
   * - createdAt: Creation time
   */
  task: {
    tasks: '++id, deviceId, status, createdAt, [deviceId+status]',
  },
}

/**
 * Merge all module schemas
 * @returns {Object} Merged full schema
 */
function mergeSchemas() {
  return Object.values(MODULE_SCHEMAS).reduce((acc, schema) => {
    return { ...acc, ...schema }
  }, {})
}

/**
 * 创建并配置 Dexie 数据库实例
 */
class AppDatabase extends Dexie {
  constructor() {
    super(DB_NAME)

    // Configure database version and schema
    this.version(DB_VERSION).stores(mergeSchemas())

    // Dynamically attach table references for easier access and type hints
    // chat 模块
    this.messages = this.table('messages')
    // task 模块
    this.tasks = this.table('tasks')
  }

  /**
   * Get all tables for a specified module
   * @param {string} moduleName - Module name
   * @returns {Object} Tables contained in the module
   */
  getModuleTables(moduleName) {
    const schema = MODULE_SCHEMAS[moduleName]
    if (!schema) {
      console.warn(`[Database] Unknown module: ${moduleName}`)
      return {}
    }

    const tables = {}
    Object.keys(schema).forEach((tableName) => {
      tables[tableName] = this.table(tableName)
    })
    return tables
  }

  /**
   * Clear all data for the specified module
   * @param {string} moduleName - Module name
   * @returns {Promise<void>}
   */
  async clearModule(moduleName) {
    const schema = MODULE_SCHEMAS[moduleName]
    if (!schema) {
      throw new Error(`Unknown module: ${moduleName}`)
    }

    const tableNames = Object.keys(schema)
    await this.transaction('rw', tableNames, async () => {
      for (const tableName of tableNames) {
        await this.table(tableName).clear()
      }
    })
  }

  /**
   * Get database statistics
   * @returns {Promise<Object>} Record counts per table
   */
  async getStats() {
    const stats = {}
    for (const [moduleName, schema] of Object.entries(MODULE_SCHEMAS)) {
      stats[moduleName] = {}
      for (const tableName of Object.keys(schema)) {
        stats[moduleName][tableName] = await this.table(tableName).count()
      }
    }
    return stats
  }
}

// 单例实例
let dbInstance = null

/**
 * 获取数据库单例实例
 * @returns {AppDatabase} 数据库实例
 */
export function getDatabase() {
  if (!dbInstance) {
    dbInstance = new AppDatabase()
  }
  return dbInstance
}

/**
 * 关闭并重置数据库连接
 * 主要用于测试或特殊场景
 */
export async function resetDatabase() {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
}

/**
 * 删除整个数据库
 * 警告：此操作不可逆！
 */
export async function deleteDatabase() {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
  await Dexie.delete(DB_NAME)
}

// 导出默认数据库实例
export const db = getDatabase()

export default db
