/**
 * @fileoverview Path manager module
 * Encapsulates path navigation, breadcrumbs and history management
 */

import '../types.js'

/** Default preset path mappings */
const DEFAULT_PRESETS = {
  sdcard: {
    icon: 'Iphone',
    label: 'device.control.file.manager.storage',
    value: '/sdcard',
  },
  root: {
    icon: 'Files',
    label: 'device.control.file.manager.root',
    value: '/',
  },
}

/**
 * Path manager hook
 * @param {import('../types.js').PathManagerOptions} [options] - Options
 * @returns {Object} Path manager instance
 */
export function usePathManager(options = {}) {
  const {
    initialPath = '/sdcard',
    historyLimit = 50,
    presets = DEFAULT_PRESETS,
  } = options

  /** @type {import('vue').Ref<string>} Current path */
  const currentPath = ref(initialPath)

  /** @type {import('vue').Ref<string[]>} Access history */
  const history = ref([initialPath])

  /** @type {import('vue').Ref<number>} History index */
  const historyIndex = ref(0)

  /**
   * Breadcrumb navigation data
   * @type {import('vue').ComputedRef<import('../types.js').BreadcrumbItem[]>}
   */
  const breadcrumbs = computed(() => {
    const slicePath = currentPath.value.slice(1)
    const segments = slicePath ? slicePath.split('/') : ['/']

    return segments.map((segment) => {
      const preset = presets[segment]
      return {
        label: segment,
        value: segment,
        ...(preset || {}),
      }
    })
  })

  /** 路径段列表 */
  const pathSegments = computed(() => {
    if (currentPath.value === '/')
      return ['/']
    return currentPath.value.split('/').filter(Boolean)
  })

  /** 父级路径 */
  const parentPath = computed(() => {
    if (currentPath.value === '/')
      return '/'
    const segments = currentPath.value.split('/').filter(Boolean)
    if (segments.length <= 1)
      return '/'
    return `/${segments.slice(0, -1).join('/')}`
  })

  /** 是否为根目录 */
  const isRoot = computed(() => currentPath.value === '/')

  /** 是否可以后退 */
  const canGoBack = computed(() => historyIndex.value > 0)

  /** 是否可以前进 */
  const canGoForward = computed(() => historyIndex.value < history.value.length - 1)

  /**
   * Navigate to a specific path
   * @param {string} path - Target path
   * @param {Object} [options] - Options
   * @param {boolean} [options.addToHistory] - Whether to add to history
   * @returns {string} Normalized path
   */
  function navigateTo(path, { addToHistory = true } = {}) {
    // 规范化路径
    const normalizedPath = normalizePath(path)

    if (normalizedPath === currentPath.value) {
      return normalizedPath
    }

    currentPath.value = normalizedPath

    if (addToHistory) {
      // 截断前进历史
      history.value = history.value.slice(0, historyIndex.value + 1)
      history.value.push(normalizedPath)

      // 限制历史记录数量
      if (history.value.length > historyLimit) {
        history.value = history.value.slice(-historyLimit)
      }

      historyIndex.value = history.value.length - 1
    }

    return normalizedPath
  }

  /**
   * Navigate to a child directory
   * @param {string} dirname - Directory name
   */
  function navigateToChild(dirname) {
    const newPath = joinPath(currentPath.value, dirname)
    return navigateTo(newPath)
  }

  /**
   * 导航到父目录
   */
  function navigateToParent() {
    if (!isRoot.value) {
      return navigateTo(parentPath.value)
    }
    return currentPath.value
  }

  /**
   * 通过面包屑导航
   * @param {import('../types.js').BreadcrumbItem} item - 面包屑项
   */
  function navigateByBreadcrumb(item) {
    const index = currentPath.value.indexOf(item.value)
    if (index !== -1) {
      const newPath = currentPath.value.slice(0, index + item.value.length)
      return navigateTo(newPath.startsWith('/') ? newPath : `/${newPath}`)
    }
    return currentPath.value
  }

  /** 后退 */
  function goBack() {
    if (canGoBack.value) {
      historyIndex.value--
      currentPath.value = history.value[historyIndex.value]
    }
    return currentPath.value
  }

  /** 前进 */
  function goForward() {
    if (canGoForward.value) {
      historyIndex.value++
      currentPath.value = history.value[historyIndex.value]
    }
    return currentPath.value
  }

  /** 重置到初始路径 */
  function reset() {
    currentPath.value = initialPath
    history.value = [initialPath]
    historyIndex.value = 0
  }

  /**
   * 规范化路径
   * @param {string} path - 原始路径
   * @returns {string} 规范化路径
   */
  function normalizePath(path) {
    // 确保以 / 开头
    let normalized = path.startsWith('/') ? path : `/${path}`
    // 移除末尾的 /（除非是根目录）
    if (normalized.length > 1 && normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1)
    }
    // 处理连续的 /
    normalized = normalized.replace(/\/+/g, '/')
    return normalized
  }

  /**
   * 连接路径
   * @param {...string} paths - 路径片段
   * @returns {string} 连接后的路径
   */
  function joinPath(...paths) {
    return normalizePath(paths.join('/'))
  }

  /**
   * 获取路径的基础名（文件/文件夹名）
   * @param {string} path - 路径
   * @returns {string} 基础名
   */
  function getBasename(path) {
    const segments = path.split('/').filter(Boolean)
    return segments[segments.length - 1] || ''
  }

  /**
   * 获取路径的目录部分
   * @param {string} path - 路径
   * @returns {string} 目录路径
   */
  function getDirname(path) {
    const segments = path.split('/').filter(Boolean)
    if (segments.length <= 1)
      return '/'
    return `/${segments.slice(0, -1).join('/')}`
  }

  return {
    // State
    currentPath: readonly(currentPath),
    breadcrumbs,
    pathSegments,
    parentPath,
    isRoot,
    canGoBack,
    canGoForward,
    history: readonly(history),
    historyIndex: readonly(historyIndex),

    // Navigation methods
    navigateTo,
    navigateToChild,
    navigateToParent,
    navigateByBreadcrumb,
    goBack,
    goForward,
    reset,

    // Utility methods
    normalizePath,
    joinPath,
    getBasename,
    getDirname,

    // Presets
    presets,
  }
}

export default usePathManager
