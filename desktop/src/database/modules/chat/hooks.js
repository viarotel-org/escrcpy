/**
 * 聊天消息 Composables - Vue 响应式聊天记录 Hook
 *
 * 设计思路：
 * 1. 封装聊天消息的响应式查询
 * 2. 提供便捷的增删改操作
 * 3. 自动同步视图与数据库
 *
 * @module storage/modules/chat/composables
 */

import { liveQuery } from 'dexie'
import { chatMessageStore, MessageStatus } from './store.js'
import { db } from '$/database/core/database.js'

/**
 * 聊天消息 Hook
 * 提供响应式的聊天消息管理功能
 *
 * @param {import('vue').Ref<string>|string} sessionIdRef - 会话ID（响应式或普通字符串）
 * @param {Object} [options] - 选项
 * @param {boolean} [options.autoLoad] - 是否自动加载
 * @param {number} [options.pageSize] - 每页数量
 * @returns {Object} 聊天消息管理对象
 *
 * @example
 * const { messages, addMessage, deleteMessage, clearAll, loading } = useChatMessages(deviceId)
 */
export function useChatMessages(sessionIdRef, options = {}) {
  const {
    autoLoad = true,
    pageSize = 100,
  } = options

  // 状态
  const messages = shallowRef([])
  const loading = ref(false)
  const error = ref(null)
  const hasMore = ref(false)
  const totalCount = ref(0)

  // 订阅句柄
  let subscription = null

  /**
   * 获取当前 sessionId
   */
  const getSessionId = () => {
    if (typeof sessionIdRef === 'object' && 'value' in sessionIdRef) {
      return sessionIdRef.value
    }
    return sessionIdRef
  }

  /**
   * 订阅消息变化（响应式）
   */
  const subscribe = () => {
    const sessionId = getSessionId()

    // 取消之前的订阅
    if (subscription) {
      subscription.unsubscribe()
      subscription = null
    }

    if (!sessionId) {
      messages.value = []
      loading.value = false
      return
    }

    loading.value = true
    error.value = null

    try {
      // 使用 liveQuery 监听数据变化
      const observable = liveQuery(async () => {
        const records = await db.messages
          .where('sessionId')
          .equals(sessionId)
          .toArray()

        // 按时间戳升序排列
        records.sort((a, b) => a.timestamp - b.timestamp)

        return records
      })

      subscription = observable.subscribe({
        next: (value) => {
          messages.value = value || []
          totalCount.value = value?.length || 0
          loading.value = false
        },
        error: (err) => {
          console.error('[useChatMessages] Subscribe error:', err)
          error.value = err
          loading.value = false
        },
      })
    }
    catch (err) {
      console.error('[useChatMessages] Subscribe setup error:', err)
      error.value = err
      loading.value = false
    }
  }

  /**
   * 添加消息
   * @param {Object} message - 消息对象
   * @returns {Promise<{success: boolean, data?: Object, error?: Object}>}
   */
  const addMessage = async (message) => {
    const sessionId = getSessionId()
    if (!sessionId) {
      return {
        success: false,
        error: { message: 'SessionId is required' },
      }
    }

    return chatMessageStore.addMessage({
      ...message,
      sessionId,
    })
  }

  /**
   * 批量添加消息
   * @param {Array} messageList - 消息数组
   * @returns {Promise<{success: boolean, data?: Array, error?: Object}>}
   */
  const addMessages = async (messageList) => {
    const sessionId = getSessionId()
    if (!sessionId) {
      return {
        success: false,
        error: { message: 'SessionId is required' },
      }
    }

    const messagesWithSession = messageList.map(msg => ({
      ...msg,
      sessionId,
      timestamp: msg.timestamp || Date.now(),
      status: msg.status || MessageStatus.COMPLETED,
    }))

    return chatMessageStore.bulkAdd(messagesWithSession)
  }

  /**
   * 删除单条消息
   * @param {number} messageId - 消息ID
   * @returns {Promise<{success: boolean, error?: Object}>}
   */
  const deleteMessage = async (messageId) => {
    return chatMessageStore.deleteById(messageId)
  }

  /**
   * 批量删除消息
   * @param {Array<number>} messageIds - 消息ID数组
   * @returns {Promise<{success: boolean, error?: Object}>}
   */
  const deleteMessages = async (messageIds) => {
    return chatMessageStore.bulkDelete(messageIds)
  }

  /**
   * 清空当前会话所有消息
   * @returns {Promise<{success: boolean, deletedCount?: number, error?: Object}>}
   */
  const clearAll = async () => {
    const sessionId = getSessionId()
    if (!sessionId) {
      return {
        success: false,
        error: { message: 'SessionId is required' },
      }
    }

    return chatMessageStore.clearSession(sessionId)
  }

  /**
   * 更新消息
   * @param {number} messageId - 消息ID
   * @param {Object} changes - 要更新的字段
   * @returns {Promise<{success: boolean, data?: Object, error?: Object}>}
   */
  const updateMessage = async (messageId, changes) => {
    return chatMessageStore.update(messageId, changes)
  }

  /**
   * 搜索消息
   * @param {string} keyword - 搜索关键词
   * @returns {Promise<{success: boolean, data?: Array, error?: Object}>}
   */
  const searchMessages = async (keyword) => {
    const sessionId = getSessionId()
    if (!sessionId) {
      return { success: true, data: [] }
    }

    return chatMessageStore.searchMessages(sessionId, keyword)
  }

  /**
   * 获取会话统计信息
   * @returns {Promise<{success: boolean, data?: Object, error?: Object}>}
   */
  const getStats = async () => {
    const sessionId = getSessionId()
    if (!sessionId) {
      return {
        success: true,
        data: {
          totalCount: 0,
          userCount: 0,
          assistantCount: 0,
          systemCount: 0,
        },
      }
    }

    return chatMessageStore.getSessionStats(sessionId)
  }

  /**
   * 刷新数据
   */
  const refresh = () => {
    subscribe()
  }

  // 监听 sessionId 变化
  if (typeof sessionIdRef === 'object' && 'value' in sessionIdRef) {
    watch(sessionIdRef, () => {
      subscribe()
    }, { immediate: autoLoad })
  }
  else if (autoLoad) {
    subscribe()
  }

  // 组件卸载时取消订阅
  onUnmounted(() => {
    if (subscription) {
      subscription.unsubscribe()
      subscription = null
    }
  })

  // 计算属性
  const isEmpty = computed(() => messages.value.length === 0)
  const lastMessage = computed(() => {
    const list = messages.value
    return list.length > 0 ? list[list.length - 1] : null
  })

  return {
    // 状态
    messages,
    loading,
    error,
    hasMore,
    totalCount,
    isEmpty,
    lastMessage,

    // 方法
    addMessage,
    addMessages,
    deleteMessage,
    deleteMessages,
    clearAll,
    updateMessage,
    searchMessages,
    getStats,
    refresh,
  }
}

/**
 * 全局聊天消息管理 Hook
 * 用于管理所有会话
 *
 * @returns {Object}
 */
export function useChatSessionManager() {
  /**
   * 获取所有会话ID
   */
  const getAllSessions = async () => {
    return chatMessageStore.getAllSessionIds()
  }

  /**
   * 删除指定会话
   * @param {string} sessionId - 会话ID
   */
  const deleteSession = async (sessionId) => {
    return chatMessageStore.clearSession(sessionId)
  }

  /**
   * 清空所有会话
   */
  const clearAllSessions = async () => {
    return chatMessageStore.clearAll()
  }

  /**
   * 获取会话统计
   * @param {string} sessionId - 会话ID
   */
  const getSessionStats = async (sessionId) => {
    return chatMessageStore.getSessionStats(sessionId)
  }

  return {
    getAllSessions,
    deleteSession,
    clearAllSessions,
    getSessionStats,
  }
}

export default {
  useChatMessages,
  useChatSessionManager,
}
