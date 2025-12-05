/**
 * @fileoverview 剪贴板操作模块
 * 封装文件复制、剪切、粘贴等剪贴板相关操作
 */

import '../types.js'

/**
 * 剪贴板操作类型
 * @typedef {'copy'|'cut'} ClipboardAction
 */

/**
 * 剪贴板 Hook
 * @returns {Object} 剪贴板管理器实例
 */
export function useFileClipboard() {
  /** @type {import('vue').Ref<import('../types.js').FileEntry[]>} 剪贴板中的项 */
  const clipboardItems = ref([])

  /** @type {import('vue').Ref<ClipboardAction|null>} 剪贴板操作类型 */
  const clipboardAction = ref(null)

  /** @type {import('vue').Ref<string>} 剪贴板来源路径 */
  const sourcePath = ref('')

  /** 是否有剪贴板内容 */
  const hasClipboard = computed(() => clipboardItems.value.length > 0)

  /** 是否为剪切操作 */
  const isCutOperation = computed(() => clipboardAction.value === 'cut')

  /** 是否为复制操作 */
  const isCopyOperation = computed(() => clipboardAction.value === 'copy')

  /** 剪贴板状态 */
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
   * 复制项到剪贴板
   * @param {import('../types.js').FileEntry|import('../types.js').FileEntry[]} items - 要复制的项
   * @param {string} currentPath - 当前路径
   */
  function copy(items, currentPath) {
    const itemArray = Array.isArray(items) ? items : [items]
    clipboardItems.value = [...itemArray]
    clipboardAction.value = 'copy'
    sourcePath.value = currentPath
  }

  /**
   * 剪切项到剪贴板
   * @param {import('../types.js').FileEntry|import('../types.js').FileEntry[]} items - 要剪切的项
   * @param {string} currentPath - 当前路径
   */
  function cut(items, currentPath) {
    const itemArray = Array.isArray(items) ? items : [items]
    clipboardItems.value = [...itemArray]
    clipboardAction.value = 'cut'
    sourcePath.value = currentPath
  }

  /**
   * 清空剪贴板
   */
  function clear() {
    clipboardItems.value = []
    clipboardAction.value = null
    sourcePath.value = ''
  }

  /**
   * 检查项是否在剪贴板中（用于 UI 显示）
   * @param {import('../types.js').FileEntry} item - 要检查的项
   * @returns {boolean}
   */
  function isInClipboard(item) {
    return clipboardItems.value.some(i => i.id === item.id)
  }

  /**
   * 检查项是否被剪切（用于 UI 显示半透明效果）
   * @param {import('../types.js').FileEntry} item - 要检查的项
   * @returns {boolean}
   */
  function isCut(item) {
    return isCutOperation.value && isInClipboard(item)
  }

  /**
   * 获取粘贴后需要删除的源项（仅剪切操作）
   * @returns {import('../types.js').FileEntry[]}
   */
  function getItemsToRemove() {
    return isCutOperation.value ? [...clipboardItems.value] : []
  }

  return {
    // 状态
    clipboardItems: readonly(clipboardItems),
    clipboardAction: readonly(clipboardAction),
    sourcePath: readonly(sourcePath),
    hasClipboard,
    isCutOperation,
    isCopyOperation,
    clipboardState,

    // 操作
    copy,
    cut,
    clear,

    // 查询
    isInClipboard,
    isCut,
    getItemsToRemove,
  }
}

export default useClipboard
