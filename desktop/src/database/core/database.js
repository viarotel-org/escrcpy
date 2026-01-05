/**
 * 核心数据库实例 - 基于 Dexie.js 的 IndexedDB 封装
 *
 * 设计思路：
 * 1. 单例模式确保全局唯一数据库实例
 * 2. 模块化 Schema 设计，支持按需扩展新模块
 * 3. 版本管理支持平滑升级
 *
 * @module storage/core/database
 */

import Dexie from 'dexie'

// 数据库名称
const DB_NAME = 'escrcpy_local_db'

// 当前数据库版本
const DB_VERSION = 1

/**
 * 模块 Schema 配置
 * 每个模块定义自己的表结构和索引
 * 索引规则：++ 为自增主键，& 为唯一索引，* 为多值索引，[a+b] 为复合索引
 */
const MODULE_SCHEMAS = {
  /**
   * 聊天消息模块
   * - id: 消息唯一标识（自增）
   * - sessionId: 会话ID，用于区分不同设备/会话的聊天记录
   * - timestamp: 消息时间戳，支持按时间范围查询
   * - role: 消息角色（user/assistant/system）
   */
  chat: {
    messages: '++id, sessionId, timestamp, role, [sessionId+timestamp]',
  },

  /**
   * 任务模块（预留）
   * - id: 任务唯一标识
   * - deviceId: 设备ID
   * - status: 任务状态
   * - createdAt: 创建时间
   */
  task: {
    tasks: '++id, deviceId, status, createdAt, [deviceId+status]',
  },
}

/**
 * 合并所有模块的 Schema
 * @returns {Object} 合并后的完整 Schema
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

    // 配置数据库版本和 Schema
    this.version(DB_VERSION).stores(mergeSchemas())

    // 动态挂载表引用，方便类型提示和访问
    // chat 模块
    this.messages = this.table('messages')
    // task 模块
    this.tasks = this.table('tasks')
  }

  /**
   * 获取指定模块的所有表
   * @param {string} moduleName - 模块名称
   * @returns {Object} 模块包含的表对象
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
   * 清空指定模块的所有数据
   * @param {string} moduleName - 模块名称
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
   * 获取数据库统计信息
   * @returns {Promise<Object>} 各表的记录数
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
