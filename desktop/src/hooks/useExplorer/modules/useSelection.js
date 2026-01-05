/**
 * @fileoverview 选择管理模块
 * 封装文件选择状态管理
 */

import '../types.js'

/**
 * 选择管理 Hook
 * @returns {Object} 选择管理器实例
 */
export function useSelection() {
  /** @type {import('vue').Ref<import('../types.js').FileEntry[]>} 已选择的项 */
  const selectedItems = ref([])

  /** @type {import('vue').Ref<Set<string>>} 已选择的 ID 集合（用于快速查找） */
  const selectedIds = ref(new Set())

  /**
   * 选择状态计算属性
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

  /** 是否有选中项 */
  const hasSelection = computed(() => selectedItems.value.length > 0)

  /** 选中数量 */
  const selectionCount = computed(() => selectedItems.value.length)

  /**
   * 选择单个项
   * @param {import('../types.js').FileEntry} item - 要选择的项
   */
  function select(item) {
    if (!selectedIds.value.has(item.id)) {
      selectedItems.value = [...selectedItems.value, item]
      selectedIds.value.add(item.id)
    }
  }

  /**
   * 取消选择单个项
   * @param {import('../types.js').FileEntry} item - 要取消的项
   */
  function deselect(item) {
    if (selectedIds.value.has(item.id)) {
      selectedItems.value = selectedItems.value.filter(i => i.id !== item.id)
      selectedIds.value.delete(item.id)
    }
  }

  /**
   * 切换选择状态
   * @param {import('../types.js').FileEntry} item - 要切换的项
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
   * 批量选择
   * @param {import('../types.js').FileEntry[]} items - 要选择的项列表
   */
  function selectMultiple(items) {
    const newItems = items.filter(item => !selectedIds.value.has(item.id))
    if (newItems.length > 0) {
      selectedItems.value = [...selectedItems.value, ...newItems]
      newItems.forEach(item => selectedIds.value.add(item.id))
    }
  }

  /**
   * 批量取消选择
   * @param {import('../types.js').FileEntry[]} items - 要取消的项列表
   */
  function deselectMultiple(items) {
    const idsToRemove = new Set(items.map(item => item.id))
    selectedItems.value = selectedItems.value.filter(item => !idsToRemove.has(item.id))
    items.forEach(item => selectedIds.value.delete(item.id))
  }

  /**
   * 全选
   * @param {import('../types.js').FileEntry[]} allItems - 所有可选项
   */
  function selectAll(allItems) {
    selectedItems.value = [...allItems]
    selectedIds.value = new Set(allItems.map(item => item.id))
  }

  /**
   * 清空选择
   */
  function clearSelection() {
    selectedItems.value = []
    selectedIds.value.clear()
  }

  /**
   * 检查项是否被选中
   * @param {import('../types.js').FileEntry} item - 要检查的项
   * @returns {boolean}
   */
  function isSelected(item) {
    return selectedIds.value.has(item.id)
  }

  /**
   * 设置选择（替换当前选择）
   * @param {import('../types.js').FileEntry[]} items - 新的选择列表
   */
  function setSelection(items) {
    selectedItems.value = [...items]
    selectedIds.value = new Set(items.map(item => item.id))
  }

  /**
   * 处理选择变更（用于与 UI 组件绑定）
   * @param {import('../types.js').FileEntry[]} selection - 新的选择
   */
  function onSelectionChange(selection) {
    setSelection(selection)
  }

  /**
   * 按类型过滤选择
   * @param {'file'|'directory'} type - 文件类型
   * @returns {import('../types.js').FileEntry[]}
   */
  function getSelectionByType(type) {
    return selectedItems.value.filter(item => item.type === type)
  }

  /**
   * 反选
   * @param {import('../types.js').FileEntry[]} allItems - 所有可选项
   */
  function invertSelection(allItems) {
    const currentIds = new Set(selectedItems.value.map(item => item.id))
    const invertedItems = allItems.filter(item => !currentIds.has(item.id))
    setSelection(invertedItems)
  }

  return {
    // 状态
    selectedItems: readonly(selectedItems),
    selectionState,
    hasSelection,
    selectionCount,

    // 单项操作
    select,
    deselect,
    toggle,
    isSelected,

    // 批量操作
    selectMultiple,
    deselectMultiple,
    selectAll,
    clearSelection,
    setSelection,
    invertSelection,

    // 查询
    getSelectionByType,

    // UI 绑定
    onSelectionChange,
  }
}

export default useSelection
