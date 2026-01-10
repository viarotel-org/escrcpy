/**
 * Chat message Composables - Vue reactive chat history Hook
 *
 * Design:
 * 1. Encapsulate reactive queries for chat messages
 * 2. Provide convenient CRUD operations
 * 3. Automatically sync view with the database
 *
 * @module storage/modules/chat/composables
 */

import { liveQuery } from 'dexie'
import { chatMessageStore, MessageStatus } from './store.js'
import { db } from '$/database/core/database.js'

/**
 * Chat messages Hook
 * Provides reactive chat message management utilities
 *
 * @param {import('vue').Ref<string>|string} sessionIdRef - Session ID (ref or plain string)
 * @param {Object} [options] - Options
 * @param {boolean} [options.autoLoad] - Whether to auto-load messages
 * @param {number} [options.pageSize] - Number per page
 * @returns {Object} Chat message management object
 *
 * @example
 * const { messages, addMessage, deleteMessage, clearAll, loading } = useChatMessages(deviceId)
 */
export function useChatMessages(sessionIdRef, options = {}) {
  const {
    autoLoad = true,
    pageSize = 100,
  } = options

  // State
  const messages = shallowRef([])
  const loading = ref(false)
  const error = ref(null)
  const hasMore = ref(false)
  const totalCount = ref(0)

  // Subscription handle
  let subscription = null

  /**
   * Get current sessionId
   */
  const getSessionId = () => {
    if (typeof sessionIdRef === 'object' && 'value' in sessionIdRef) {
      return sessionIdRef.value
    }
    return sessionIdRef
  }

  /**
   * Subscribe to message changes (reactive)
   */
  const subscribe = () => {
    const sessionId = getSessionId()

    // Unsubscribe previous subscription
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
      // Use liveQuery to observe data changes
      const observable = liveQuery(async () => {
        const records = await db.messages
          .where('sessionId')
          .equals(sessionId)
          .toArray()

        // Sort by timestamp ascending
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
   * Add message
   * @param {Object} message - Message object
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
   * Bulk add messages
   * @param {Array} messageList - Array of messages
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
   * Delete a message
   * @param {number} messageId - Message ID
   * @returns {Promise<{success: boolean, error?: Object}>}
   */
  const deleteMessage = async (messageId) => {
    return chatMessageStore.deleteById(messageId)
  }

  /**
   * Bulk delete messages
   * @param {Array<number>} messageIds - Array of message IDs
   * @returns {Promise<{success: boolean, error?: Object}>}
   */
  const deleteMessages = async (messageIds) => {
    return chatMessageStore.bulkDelete(messageIds)
  }

  /**
   * Clear all messages for the current session
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
   * Update message
   * @param {number} messageId - Message ID
   * @param {Object} changes - Fields to update
   * @returns {Promise<{success: boolean, data?: Object, error?: Object}>}
   */
  const updateMessage = async (messageId, changes) => {
    return chatMessageStore.update(messageId, changes)
  }

  /**
   * Search messages
   * @param {string} keyword - Search keyword
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
   * Get session statistics
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
   * Refresh data
   */
  const refresh = () => {
    subscribe()
  }

  // Watch for sessionId changes
  if (typeof sessionIdRef === 'object' && 'value' in sessionIdRef) {
    watch(sessionIdRef, () => {
      subscribe()
    }, { immediate: autoLoad })
  }
  else if (autoLoad) {
    subscribe()
  }

  // Unsubscribe when component unmounts
  onUnmounted(() => {
    if (subscription) {
      subscription.unsubscribe()
      subscription = null
    }
  })

  // Computed properties
  const isEmpty = computed(() => messages.value.length === 0)
  const lastMessage = computed(() => {
    const list = messages.value
    return list.length > 0 ? list[list.length - 1] : null
  })

  return {
    // State
    messages,
    loading,
    error,
    hasMore,
    totalCount,
    isEmpty,
    lastMessage,

    // Methods
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
 * Global chat session manager Hook
 * Used to manage all sessions
 *
 * @returns {Object}
 */
export function useChatSessionManager() {
  /**
   * Get all session IDs
   */
  const getAllSessions = async () => {
    return chatMessageStore.getAllSessionIds()
  }

  /**
   * Delete specified session
   * @param {string} sessionId - Session ID
   */
  const deleteSession = async (sessionId) => {
    return chatMessageStore.clearSession(sessionId)
  }

  /**
   * Clear all sessions
   */
  const clearAllSessions = async () => {
    return chatMessageStore.clearAll()
  }

  /**
   * Get session statistics
   * @param {string} sessionId - Session ID
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
