/**
 * Local storage architecture entry point
 *
 * Architecture overview:
 * ├── core/           # Core layer - database instance, Base Store classes
 * │   ├── database.js # Dexie database wrapper and schema definitions
 * │   └── BaseStore.js # Base Store class providing common CRUD interfaces
 * │
 * ├── hooks/          # Vue reactive hooks
 * │   └── useLiveQuery.js # Reactive queries based on liveQuery
 * │
 * ├── modules/        # Business modules
 * │   ├── chat/       # Chat messages module
 * │   │   ├── store.js      # ChatMessageStore
 * │   │   └── composables.js # useChatMessages Hook
 * │   └── [future]/   # Future modules (tasks, etc.)
 * │
 * └── utils/          # Utility functions
 *     └── validation.js # Data validation and error handling
 *
 * Usage example:
 * ```javascript
 * import { useChatMessages } from '$/database'
 *
 * // In a Vue component:
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
