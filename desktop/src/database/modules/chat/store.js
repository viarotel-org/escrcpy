/**
 * Chat message Store - chat record module based on BaseStore
 *
 * Design goals:
 * 1. Inherit BaseStore to obtain common CRUD capabilities
 * 2. Extend chat-specific query methods (by session, by time range)
 * 3. Support paginated message loading to avoid performance issues with large data sets
 *
 * @module storage/modules/chat
 */

import { BaseStore } from '$/database/core/BaseStore.js'
import { FieldTypes } from '$/database/utils/validation.js'

/**
 * Message role enumeration
 */
export const MessageRole = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
}

/**
 * Message status enumeration
 */
export const MessageStatus = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  STOPPED: 'stopped',
}

/**
 * Message field schema
 */
const messageSchema = {
  sessionId: {
    type: FieldTypes.STRING,
    required: true,
  },
  role: {
    type: FieldTypes.STRING,
    required: true,
    enum: Object.values(MessageRole),
  },
  content: {
    type: FieldTypes.STRING,
    required: true,
  },
  timestamp: {
    type: FieldTypes.NUMBER,
  },
  status: {
    type: FieldTypes.STRING,
    enum: Object.values(MessageStatus),
  },
}

/**
 * ChatMessageStore class
 */
class ChatMessageStore extends BaseStore {
  constructor() {
    super({
      tableName: 'messages',
      schema: messageSchema,
      primaryKey: 'id',
      requiredFields: ['sessionId', 'role', 'content'],
    })
  }

  /**
   * Add a chat message
   * @param {Object} message - Message object
   * @param {string} message.sessionId - Session ID
   * @param {string} message.role - Message role (user/assistant/system)
   * @param {string} message.content - Message content
   * @param {number} [message.timestamp] - Timestamp
   * @param {string} [message.status] - Message status
   * @param {Object} [message.metadata] - Additional metadata
   * @returns {Promise<{success: boolean, data?: Object, error?: Object}>}
   */
  async addMessage(message) {
    const data = {
      ...message,
      timestamp: message.timestamp || Date.now(),
      status: message.status || MessageStatus.COMPLETED,
    }
    return this.add(data)
  }

  /**
   * Get all messages for a given session
   * @param {string} sessionId - Session ID
   * @param {Object} [options] - Query options
   * @param {boolean} [options.desc] - Whether to use descending order (default ascending by timestamp)
   * @returns {Promise<{success: boolean, data?: Array, error?: Object}>}
   */
  async getSessionMessages(sessionId, options = {}) {
    try {
      const { desc = false } = options

      const records = await this.table
        .where('sessionId')
        .equals(sessionId)
        .toArray()

      // Sort by timestamp
      records.sort((a, b) => {
        return desc ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
      })

      return { success: true, data: records }
    }
    catch (error) {
      console.error('[ChatMessageStore] getSessionMessages error:', error)
      return {
        success: false,
        error: {
          type: 'READ_ERROR',
          message: error.message,
        },
      }
    }
  }

  /**
   * Paginated retrieval of session messages (supports lazy loading)
   * @param {string} sessionId - Session ID
   * @param {Object} params - Pagination parameters
   * @param {number} [params.page] - Page number
   * @param {number} [params.pageSize] - Items per page
   * @param {number} [params.beforeTimestamp] - Get messages before this timestamp (for loading older history)
   * @returns {Promise<{success: boolean, data?: Object, error?: Object}>}
   */
  async getSessionMessagesPaginated(sessionId, params = {}) {
    try {
      const {
        page = 1,
        pageSize = 50,
        beforeTimestamp,
      } = params

      const collection = this.table.where('sessionId').equals(sessionId)

      // If beforeTimestamp is specified, filter by time
      let records = await collection.toArray()

      if (beforeTimestamp) {
        records = records.filter(r => r.timestamp < beforeTimestamp)
      }

      // Sort by timestamp descending (newest first)
      records.sort((a, b) => b.timestamp - a.timestamp)

      const total = records.length
      const offset = (page - 1) * pageSize
      const list = records.slice(offset, offset + pageSize)

      // Reverse before returning so messages are in ascending time order
      list.reverse()

      return {
        success: true,
        data: {
          list,
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
          hasMore: offset + pageSize < total,
        },
      }
    }
    catch (error) {
      console.error('[ChatMessageStore] getSessionMessagesPaginated error:', error)
      return {
        success: false,
        error: {
          type: 'READ_ERROR',
          message: error.message,
        },
      }
    }
  }

  /**
   * Get messages within a specified time range
   * @param {string} sessionId - Session ID
   * @param {number} startTime - Start timestamp
   * @param {number} endTime - End timestamp
   * @returns {Promise<{success: boolean, data?: Array, error?: Object}>}
   */
  async getMessagesByTimeRange(sessionId, startTime, endTime) {
    try {
      const records = await this.table
        .where('[sessionId+timestamp]')
        .between(
          [sessionId, startTime],
          [sessionId, endTime],
          true,
          true,
        )
        .toArray()

      // Sort by timestamp ascending
      records.sort((a, b) => a.timestamp - b.timestamp)

      return { success: true, data: records }
    }
    catch (error) {
      console.error('[ChatMessageStore] getMessagesByTimeRange error:', error)
      return {
        success: false,
        error: {
          type: 'READ_ERROR',
          message: error.message,
        },
      }
    }
  }

  /**
   * Delete all messages for a session
   * @param {string} sessionId - Session ID
   * @returns {Promise<{success: boolean, deletedCount?: number, error?: Object}>}
   */
  async clearSession(sessionId) {
    try {
      const count = await this.table
        .where('sessionId')
        .equals(sessionId)
        .delete()

      return { success: true, deletedCount: count }
    }
    catch (error) {
      console.error('[ChatMessageStore] clearSession error:', error)
      return {
        success: false,
        error: {
          type: 'WRITE_ERROR',
          message: error.message,
        },
      }
    }
  }

  /**
   * Get list of all session IDs
   * @returns {Promise<{success: boolean, data?: Array<string>, error?: Object}>}
   */
  async getAllSessionIds() {
    try {
      const records = await this.table.orderBy('sessionId').uniqueKeys()
      return { success: true, data: records }
    }
    catch (error) {
      console.error('[ChatMessageStore] getAllSessionIds error:', error)
      return {
        success: false,
        error: {
          type: 'READ_ERROR',
          message: error.message,
        },
      }
    }
  }

  /**
   * Get session statistics
   * @param {string} sessionId - Session ID
   * @returns {Promise<{success: boolean, data?: Object, error?: Object}>}
   */
  async getSessionStats(sessionId) {
    try {
      const messages = await this.table
        .where('sessionId')
        .equals(sessionId)
        .toArray()

      if (messages.length === 0) {
        return {
          success: true,
          data: {
            totalCount: 0,
            userCount: 0,
            assistantCount: 0,
            systemCount: 0,
            firstMessageTime: null,
            lastMessageTime: null,
          },
        }
      }

      const stats = {
        totalCount: messages.length,
        userCount: messages.filter(m => m.role === MessageRole.USER).length,
        assistantCount: messages.filter(m => m.role === MessageRole.ASSISTANT).length,
        systemCount: messages.filter(m => m.role === MessageRole.SYSTEM).length,
        firstMessageTime: Math.min(...messages.map(m => m.timestamp)),
        lastMessageTime: Math.max(...messages.map(m => m.timestamp)),
      }

      return { success: true, data: stats }
    }
    catch (error) {
      console.error('[ChatMessageStore] getSessionStats error:', error)
      return {
        success: false,
        error: {
          type: 'READ_ERROR',
          message: error.message,
        },
      }
    }
  }

  /**
   * Search message content
   * @param {string} sessionId - Session ID
   * @param {string} keyword - Search keyword
   * @returns {Promise<{success: boolean, data?: Array, error?: Object}>}
   */
  async searchMessages(sessionId, keyword) {
    try {
      if (!keyword || keyword.trim() === '') {
        return { success: true, data: [] }
      }

      const lowerKeyword = keyword.toLowerCase()
      const records = await this.table
        .where('sessionId')
        .equals(sessionId)
        .filter(msg => msg.content.toLowerCase().includes(lowerKeyword))
        .toArray()

      // Sort by timestamp ascending
      records.sort((a, b) => a.timestamp - b.timestamp)

      return { success: true, data: records }
    }
    catch (error) {
      console.error('[ChatMessageStore] searchMessages error:', error)
      return {
        success: false,
        error: {
          type: 'READ_ERROR',
          message: error.message,
        },
      }
    }
  }
}

// Export singleton instance
export const chatMessageStore = new ChatMessageStore()

export default chatMessageStore
