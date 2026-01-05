/**
 * 聊天消息 Store - 基于 BaseStore 的聊天记录模块
 *
 * 设计思路：
 * 1. 继承 BaseStore 获得通用 CRUD 能力
 * 2. 扩展聊天特有的查询方法（按会话、按时间范围）
 * 3. 支持消息分页加载，避免大量数据导致性能问题
 *
 * @module storage/modules/chat
 */

import { BaseStore } from '$/database/core/BaseStore.js'
import { FieldTypes } from '$/database/utils/validation.js'

/**
 * 消息角色枚举
 */
export const MessageRole = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
}

/**
 * 消息状态枚举
 */
export const MessageStatus = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  STOPPED: 'stopped',
}

/**
 * 消息字段 Schema
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
 * 聊天消息 Store 类
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
   * 添加聊天消息
   * @param {Object} message - 消息对象
   * @param {string} message.sessionId - 会话ID
   * @param {string} message.role - 消息角色 (user/assistant/system)
   * @param {string} message.content - 消息内容
   * @param {number} [message.timestamp] - 时间戳
   * @param {string} [message.status] - 消息状态
   * @param {Object} [message.metadata] - 额外元数据
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
   * 获取指定会话的所有消息
   * @param {string} sessionId - 会话ID
   * @param {Object} [options] - 查询选项
   * @param {boolean} [options.desc] - 是否降序（默认升序，按时间顺序）
   * @returns {Promise<{success: boolean, data?: Array, error?: Object}>}
   */
  async getSessionMessages(sessionId, options = {}) {
    try {
      const { desc = false } = options

      const records = await this.table
        .where('sessionId')
        .equals(sessionId)
        .toArray()

      // 按时间戳排序
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
   * 分页获取会话消息（支持懒加载）
   * @param {string} sessionId - 会话ID
   * @param {Object} params - 分页参数
   * @param {number} [params.page] - 页码
   * @param {number} [params.pageSize] - 每页数量
   * @param {number} [params.beforeTimestamp] - 获取此时间戳之前的消息（用于向上加载历史）
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

      // 如果指定了 beforeTimestamp，过滤时间
      let records = await collection.toArray()

      if (beforeTimestamp) {
        records = records.filter(r => r.timestamp < beforeTimestamp)
      }

      // 按时间戳降序排序（最新的在前）
      records.sort((a, b) => b.timestamp - a.timestamp)

      const total = records.length
      const offset = (page - 1) * pageSize
      const list = records.slice(offset, offset + pageSize)

      // 返回时反转，让消息按时间升序排列
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
   * 获取时间范围内的消息
   * @param {string} sessionId - 会话ID
   * @param {number} startTime - 开始时间戳
   * @param {number} endTime - 结束时间戳
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

      // 按时间升序
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
   * 删除指定会话的所有消息
   * @param {string} sessionId - 会话ID
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
   * 获取所有会话ID列表
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
   * 获取会话统计信息
   * @param {string} sessionId - 会话ID
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
   * 搜索消息内容
   * @param {string} sessionId - 会话ID
   * @param {string} keyword - 搜索关键词
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

      // 按时间升序
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

// 导出单例实例
export const chatMessageStore = new ChatMessageStore()

export default chatMessageStore
