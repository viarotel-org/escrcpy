/**
 * @fileoverview 路径管理模块
 * 封装路径导航、面包屑、历史记录等功能
 */

import '../types.js'

/** 默认预设路径映射 */
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
 * 路径管理 Hook
 * @param {import('../types.js').PathManagerOptions} [options] - 配置选项
 * @returns {Object} 路径管理器实例
 */
export function usePathManager(options = {}) {
  const {
    initialPath = '/sdcard',
    historyLimit = 50,
    presets = DEFAULT_PRESETS,
  } = options

  /** @type {import('vue').Ref<string>} 当前路径 */
  const currentPath = ref(initialPath)

  /** @type {import('vue').Ref<string[]>} 访问历史 */
  const history = ref([initialPath])

  /** @type {import('vue').Ref<number>} 历史索引 */
  const historyIndex = ref(0)

  /**
   * 面包屑导航数据
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
   * 导航到指定路径
   * @param {string} path - 目标路径
   * @param {Object} [options] - 选项
   * @param {boolean} [options.addToHistory] - 是否添加到历史
   * @returns {string} 规范化后的路径
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
   * 导航到子目录
   * @param {string} dirname - 目录名
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
    // 状态
    currentPath: readonly(currentPath),
    breadcrumbs,
    pathSegments,
    parentPath,
    isRoot,
    canGoBack,
    canGoForward,
    history: readonly(history),
    historyIndex: readonly(historyIndex),

    // 导航方法
    navigateTo,
    navigateToChild,
    navigateToParent,
    navigateByBreadcrumb,
    goBack,
    goForward,
    reset,

    // 工具方法
    normalizePath,
    joinPath,
    getBasename,
    getDirname,

    // 预设
    presets,
  }
}

export default usePathManager
