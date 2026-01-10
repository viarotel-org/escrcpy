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
 * Create and configure the Dexie database instance
 */
class AppDatabase extends Dexie {
  constructor() {
    super(DB_NAME)

    // Configure database version and schema
    this.version(DB_VERSION).stores(mergeSchemas())

    // Dynamically attach table references for easier access and type hints
    // Chat module
    this.messages = this.table('messages')
    // Task module
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

// Singleton instance
let dbInstance = null

/**
 * Get the singleton database instance
 * @returns {AppDatabase} Database instance
 */
export function getDatabase() {
  if (!dbInstance) {
    dbInstance = new AppDatabase()
  }
  return dbInstance
}

/**
 * Close and reset the database connection
 * Mainly used for testing or special scenarios
 */
export async function resetDatabase() {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
}

/**
 * Delete the entire database
 * Warning: this operation is irreversible!
 */
export async function deleteDatabase() {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
  await Dexie.delete(DB_NAME)
}

// Export default database instance
export const db = getDatabase()

export default db
