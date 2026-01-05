/**
 * 本地存储架构主入口
 *
 * 架构概述：
 * ├── core/           # 核心层 - 数据库实例、基础 Store 类
 * │   ├── database.js # Dexie 数据库封装，Schema 定义
 * │   └── BaseStore.js # 通用 Store 基类，提供统一 CRUD 接口
 * │
 * ├── hooks/          # Vue 响应式 Hooks
 * │   └── useLiveQuery.js # 基于 liveQuery 的响应式查询
 * │
 * ├── modules/        # 业务模块
 * │   ├── chat/       # 聊天消息模块
 * │   │   ├── store.js      # ChatMessageStore
 * │   │   └── composables.js # useChatMessages Hook
 * │   └── [future]/   # 未来扩展模块（task 等）
 * │
 * └── utils/          # 工具函数
 *     └── validation.js # 数据校验、错误处理
 *
 * 使用示例：
 * ```javascript
 * import { useChatMessages } from '$/database'
 *
 * // 在 Vue 组件中使用
 * const { messages, addMessage, deleteMessage, clearAll } = useChatMessages(deviceId)
 * ```
 *
 * @module storage
 */

// 核心层
export { BaseStore, db, deleteDatabase, getDatabase, resetDatabase } from './core/index.js'

// Hooks
export { useLiveQuery, useLiveQueryWithDeps, useLiveQueryWithState } from './hooks/index.js'

// 聊天模块
export {
  chatMessageStore,
  useChatMessages,
} from './modules/chat/index.js'

// 工具函数
export {
  createStorageError,
  FieldTypes,
  generateId,
  StorageErrorTypes,
  validateData,
} from './utils/index.js'
