/**
 * @fileoverview Selection management module
 * Encapsulates file selection state management
 */

import '../types.js'

/**
 * Selection management hook
 * @returns {Object} Selection manager instance
 */
export function useSelection() {
  /** @type {import('vue').Ref<import('../types.js').FileEntry[]>} Selected items */
  const selectedItems = ref([])

  /** @type {import('vue').Ref<Set<string>>} Set of selected IDs (for fast lookup) */
  const selectedIds = ref(new Set())

  /**
   * Selection state computed property
   * @type {import('vue').ComputedRef<import('../types.js').SelectionState>}
   */
  const selectionState = computed(() => {
    const items = selectedItems.value
    return {
      items,
      hasFiles: items.some(item => item.type === 'file'),
      hasDirectories: items.some(item => item.type === 'directory'),
      count: items.length,
      isEmpty: items.length === 0,
      files: items.filter(item => item.type === 'file'),
      directories: items.filter(item => item.type === 'directory'),
    }
  })

  /** Whether there is a selection */
  const hasSelection = computed(() => selectedItems.value.length > 0)

  /** Selection count */
  const selectionCount = computed(() => selectedItems.value.length)

  /**
   * Select a single item
   * @param {import('../types.js').FileEntry} item - Item to select
   */
  function select(item) {
    if (!selectedIds.value.has(item.id)) {
      selectedItems.value = [...selectedItems.value, item]
      selectedIds.value.add(item.id)
    }
  }

  /**
   * Deselect a single item
   * @param {import('../types.js').FileEntry} item - Item to deselect
   */
  function deselect(item) {
    if (selectedIds.value.has(item.id)) {
      selectedItems.value = selectedItems.value.filter(i => i.id !== item.id)
      selectedIds.value.delete(item.id)
    }
  }

  /**
   * Toggle selection state
   * @param {import('../types.js').FileEntry} item - Item to toggle
   */
  function toggle(item) {
    if (isSelected(item)) {
      deselect(item)
    }
    else {
      select(item)
    }
  }

  /**
   * Select multiple items
   * @param {import('../types.js').FileEntry[]} items - Items to select
   */
  function selectMultiple(items) {
    const newItems = items.filter(item => !selectedIds.value.has(item.id))
    if (newItems.length > 0) {
      selectedItems.value = [...selectedItems.value, ...newItems]
      newItems.forEach(item => selectedIds.value.add(item.id))
    }
  }

  /**
   * Deselect multiple items
   * @param {import('../types.js').FileEntry[]} items - Items to deselect
   */
  function deselectMultiple(items) {
    const idsToRemove = new Set(items.map(item => item.id))
    selectedItems.value = selectedItems.value.filter(item => !idsToRemove.has(item.id))
    items.forEach(item => selectedIds.value.delete(item.id))
  }

  /**
   * Select all
   * @param {import('../types.js').FileEntry[]} allItems - All selectable items
   */
  function selectAll(allItems) {
    selectedItems.value = [...allItems]
    selectedIds.value = new Set(allItems.map(item => item.id))
  }

  /**
   * Clear selection
   */
  function clearSelection() {
    selectedItems.value = []
    selectedIds.value.clear()
  }

  /**
   * Check if an item is selected
   * @param {import('../types.js').FileEntry} item - Item to check
   * @returns {boolean}
   */
  function isSelected(item) {
    return selectedIds.value.has(item.id)
  }

  /**
   * Set selection (replace current selection)
   * @param {import('../types.js').FileEntry[]} items - New selection list
   */
  function setSelection(items) {
    selectedItems.value = [...items]
    selectedIds.value = new Set(items.map(item => item.id))
  }

  /**
   * Handle selection change (for UI binding)
   * @param {import('../types.js').FileEntry[]} selection - New selection
   */
  function onSelectionChange(selection) {
    setSelection(selection)
  }

  /**
   * Filter selection by type
   * @param {'file'|'directory'} type - Item type
   * @returns {import('../types.js').FileEntry[]}
   */
  function getSelectionByType(type) {
    return selectedItems.value.filter(item => item.type === type)
  }

  /**
   * Invert selection
   * @param {import('../types.js').FileEntry[]} allItems - All selectable items
   */
  function invertSelection(allItems) {
    const currentIds = new Set(selectedItems.value.map(item => item.id))
    const invertedItems = allItems.filter(item => !currentIds.has(item.id))
    setSelection(invertedItems)
  }

  return {
    // State
    selectedItems: readonly(selectedItems),
    selectionState,
    hasSelection,
    selectionCount,

    // Single item operations
    select,
    deselect,
    toggle,
    isSelected,

    // Batch operations
    selectMultiple,
    deselectMultiple,
    selectAll,
    clearSelection,
    setSelection,
    invertSelection,

    // Queries
    getSelectionByType,

    // UI bindings
    onSelectionChange,
  }
}

export default useSelection
