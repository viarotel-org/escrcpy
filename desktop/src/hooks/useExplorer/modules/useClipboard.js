/**
 * @fileoverview Clipboard operations module
 * Encapsulates file copy, cut, paste and other clipboard related operations
 */

import '../types.js'

/**
 * Clipboard action type
 * @typedef {'copy'|'cut'} ClipboardAction
 */

/**
 * Clipboard hook
 * @returns {Object} Clipboard manager instance
 */
export function useFileClipboard() {
  /** @type {import('vue').Ref<import('../types.js').FileEntry[]>} Items in clipboard */
  const clipboardItems = ref([])

  /** @type {import('vue').Ref<ClipboardAction|null>} Clipboard action type */
  const clipboardAction = ref(null)

  /** @type {import('vue').Ref<string>} Clipboard source path */
  const sourcePath = ref('')

  /** Whether clipboard has content */
  const hasClipboard = computed(() => clipboardItems.value.length > 0)

  /** Whether it's cut operation */
  const isCutOperation = computed(() => clipboardAction.value === 'cut')

  /** Whether it's copy operation */
  const isCopyOperation = computed(() => clipboardAction.value === 'copy')

  /** Clipboard state */
  const clipboardState = computed(() => ({
    items: clipboardItems.value,
    action: clipboardAction.value,
    sourcePath: sourcePath.value,
    count: clipboardItems.value.length,
    isEmpty: clipboardItems.value.length === 0,
    isCut: clipboardAction.value === 'cut',
    isCopy: clipboardAction.value === 'copy',
  }))

  /**
   * Copy items to clipboard
   * @param {import('../types.js').FileEntry|import('../types.js').FileEntry[]} items - Items to copy
   * @param {string} currentPath - Current path
   */
  function copy(items, currentPath) {
    const itemArray = Array.isArray(items) ? items : [items]
    clipboardItems.value = [...itemArray]
    clipboardAction.value = 'copy'
    sourcePath.value = currentPath
  }

  /**
   * Cut items to clipboard
   * @param {import('../types.js').FileEntry|import('../types.js').FileEntry[]} items - Items to cut
   * @param {string} currentPath - Current path
   */
  function cut(items, currentPath) {
    const itemArray = Array.isArray(items) ? items : [items]
    clipboardItems.value = [...itemArray]
    clipboardAction.value = 'cut'
    sourcePath.value = currentPath
  }

  /**
   * Clear clipboard
   */
  function clear() {
    clipboardItems.value = []
    clipboardAction.value = null
    sourcePath.value = ''
  }

  /**
   * Check whether an item is in the clipboard (for UI display)
   * @param {import('../types.js').FileEntry} item - Item to check
   * @returns {boolean}
   */
  function isInClipboard(item) {
    return clipboardItems.value.some(i => i.id === item.id)
  }

  /**
   * Check whether an item is cut (for UI translucent effect)
   * @param {import('../types.js').FileEntry} item - Item to check
   * @returns {boolean}
   */
  function isCut(item) {
    return isCutOperation.value && isInClipboard(item)
  }

  /**
   * Get items to remove after paste (cut operations only)
   * @returns {import('../types.js').FileEntry[]}
   */
  function getItemsToRemove() {
    return isCutOperation.value ? [...clipboardItems.value] : []
  }

  return {
    // State
    clipboardItems: readonly(clipboardItems),
    clipboardAction: readonly(clipboardAction),
    sourcePath: readonly(sourcePath),
    hasClipboard,
    isCutOperation,
    isCopyOperation,
    clipboardState,

    // Actions
    copy,
    cut,
    clear,

    // Queries
    isInClipboard,
    isCut,
    getItemsToRemove,
  }
}

export default useClipboard
