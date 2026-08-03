/**
 * @fileoverview Quick access module
 * Manages favorites and recent access history for the file explorer
 */

import '../types.js'
import { toPlainValue } from '$/utils'

/** Maximum number of recent items to keep */
export const MAX_RECENT_ITEMS = 10

/** Maximum number of favorites to display in dropdown */
export const DISPLAY_LIMIT = 100

/**
 * Quick access hook
 * @param {Object} options - Configuration options
 * @param {import('vue').Ref<string>} options.deviceId - Device ID for isolation
 * @returns {Object} Quick access manager instance
 */
export function useQuickAccess({ deviceId }) {
  /** @type {typeof window.$preload.store} */
  const $store = window.$preload.store

  /** @type {import('vue').Ref<import('../types.js').QuickAccessItem[]>} All quick access items */
  const items = ref([])

  /** @type {import('vue').Ref<string|null>} File ID to highlight after navigation */
  const pendingHighlightId = ref(null)

  // ========== Computed ==========

  /** Favorite items sorted by order then createdAt */
  const favorites = computed(() =>
    items.value
      .filter(item => item.favorite)
      .sort((a, b) => (a.order - b.order) || (a.createdAt - b.createdAt)),
  )

  /** Recent items sorted by visitedAt descending, limited to MAX_RECENT_ITEMS */
  const recentItems = computed(() =>
    items.value
      .filter(item => item.visitedAt != null)
      .sort((a, b) => b.visitedAt - a.visitedAt)
      .slice(0, MAX_RECENT_ITEMS),
  )

  /** Set of favorite IDs for quick lookup */
  const favoriteIds = computed(() => new Set(favorites.value.map(item => item.id)))

  // ========== Favorites ==========

  /**
   * Add or update a favorite
   * @param {Object} item - Item to favorite
   * @param {string} item.id - Full path (unique identifier)
   * @param {string} item.name - Display name
   * @param {string} item.type - Entry type ('directory' or 'file')
   * @param {string} item.parentPath - Parent path
   */
  function addFavorite(item) {
    const existing = items.value.find(i => i.id === item.id)
    if (existing) {
      existing.favorite = true
      existing.name = item.name
      existing.parentPath = item.parentPath
    }
    else {
      items.value.push({
        id: item.id,
        name: item.name,
        type: item.type,
        parentPath: item.parentPath,
        favorite: true,
        visitedAt: null,
        createdAt: Date.now(),
        order: 0,
      })
    }
    save()
  }

  /**
   * Remove a favorite (keeps item if it has visitedAt)
   * @param {string} id - Item ID (full path)
   */
  function removeFavorite(id) {
    const existing = items.value.find(i => i.id === id)
    if (existing) {
      existing.favorite = false
      cleanupItems()
      save()
    }
  }

  /**
   * Toggle favorite status
   * @param {Object} item - Item to toggle
   * @param {string} item.id - Full path
   * @param {string} item.name - Display name
   * @param {string} item.type - Entry type
   * @param {string} item.parentPath - Parent path
   */
  function toggleFavorite(item) {
    if (isFavorite(item.id)) {
      removeFavorite(item.id)
    }
    else {
      addFavorite(item)
    }
  }

  /**
   * Check if an item is favorited
   * @param {string} id - Item ID (full path)
   * @returns {boolean}
   */
  function isFavorite(id) {
    return favoriteIds.value.has(id)
  }

  // ========== Recent access ==========

  /**
   * Record a visit to an item (only directories)
   * Creates or updates the item, then prunes history
   * @param {Object} item - Visited item
   * @param {string} item.id - Full path
   * @param {string} item.name - Display name
   * @param {string} item.type - Entry type ('directory' only for recent)
   * @param {string} item.parentPath - Parent path
   */
  function touch(item) {
    if (item.type !== 'directory')
      return

    const existing = items.value.find(i => i.id === item.id)
    if (existing) {
      existing.visitedAt = Date.now()
      existing.name = item.name
      existing.parentPath = item.parentPath
    }
    else {
      items.value.push({
        id: item.id,
        name: item.name,
        type: item.type,
        parentPath: item.parentPath,
        favorite: false,
        visitedAt: Date.now(),
        createdAt: Date.now(),
        order: 0,
      })
    }

    pruneRecentHistory()
    cleanupItems()
    save()
  }

  /** Alias for touch */
  const addRecent = touch

  // ========== Open (business closure) ==========

  /**
   * Open a quick access item with validation
   * @param {Object} item - Item to open
   * @param {Object} callbacks - Business callbacks
   * @param {function(Object): Promise<boolean>} callbacks.validate - Validate item exists
   * @param {function(Object): Promise<void>} callbacks.onOpen - Execute navigation
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async function open(item, { validate, onOpen }) {
    const exists = await validate(item)
    if (!exists) {
      return { success: false, error: 'pathNotFound' }
    }

    // For files: navigate to parent directory and set pending highlight
    if (item.type === 'file') {
      pendingHighlightId.value = item.id
      await onOpen({ ...item, id: item.parentPath })
    }
    else {
      await onOpen(item)
      touch(item)
    }

    return { success: true }
  }

  // ========== Cleanup ==========

  /**
   * Prune recent history to keep only the most recent MAX_RECENT_ITEMS
   * Only affects visitedAt, does not touch favorites
   */
  function pruneRecentHistory() {
    const recent = items.value
      .filter(i => i.visitedAt != null)
      .sort((a, b) => b.visitedAt - a.visitedAt)

    if (recent.length > MAX_RECENT_ITEMS) {
      const toPrune = recent.slice(MAX_RECENT_ITEMS)
      for (const item of toPrune) {
        item.visitedAt = null
      }
    }
  }

  /**
   * Remove items that have no favorite and no recent visit (dead data)
   */
  function cleanupItems() {
    items.value = items.value.filter(i => i.favorite || i.visitedAt != null)
  }

  /**
   * Clear all recent access history
   */
  function clearRecent() {
    for (const item of items.value) {
      item.visitedAt = null
    }
    cleanupItems()
    save()
  }

  // ========== Persistence ==========

  /** Get the store key for the current device */
  function getStoreKey() {
    return ['explorer', 'quickAccess', deviceId.value]
  }

  /**
   * Load quick access data from store
   */
  function load() {
    if (!deviceId.value) {
      return
    }

    try {
      const data = $store.get(getStoreKey())

      if (data?.items && Array.isArray(data.items)) {
        items.value = data.items
      }
      else {
        items.value = []
      }
    }
    catch {
      items.value = []
    }
  }

  /**
   * Save quick access data to store
   * Uses toPlainValue to fully strip Vue reactivity — toRaw only unwraps
   * the top-level proxy; nested item objects remain reactive after
   * cleanupItems() reassigns items.value via Array.filter(), which causes
   * electron-store's structuredClone to silently fail.
   */
  function save() {
    if (!deviceId.value) {
      return
    }

    try {
      const plain = toPlainValue(items.value)
      $store.set(getStoreKey(), { items: plain })
    }
    catch (err) {
      console.error('[quickAccess] save failed:', err)
    }
  }

  return {
    // ========== Data ==========
    items,
    favorites,
    recentItems,
    favoriteIds,

    // ========== Favorites ==========
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,

    // ========== Recent ==========
    touch,
    addRecent,

    // ========== Open ==========
    open,
    pendingHighlightId: readonly(pendingHighlightId),
    clearPendingHighlight: () => { pendingHighlightId.value = null },

    // ========== Cleanup ==========
    clearRecent,
    pruneRecentHistory,
    cleanupItems,

    // ========== Persistence ==========
    load,
    save,

    // ========== Constants ==========
    DISPLAY_LIMIT,
  }
}
