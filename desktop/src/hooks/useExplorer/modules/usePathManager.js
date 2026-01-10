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

  /** Path segment list */
  const pathSegments = computed(() => {
    if (currentPath.value === '/')
      return ['/']
    return currentPath.value.split('/').filter(Boolean)
  })

  /** Parent path */
  const parentPath = computed(() => {
    if (currentPath.value === '/')
      return '/'
    const segments = currentPath.value.split('/').filter(Boolean)
    if (segments.length <= 1)
      return '/'
    return `/${segments.slice(0, -1).join('/')}`
  })

  /** Whether this is the root directory */
  const isRoot = computed(() => currentPath.value === '/')

  /** Whether navigation can go back */
  const canGoBack = computed(() => historyIndex.value > 0)

  /** Whether navigation can go forward */
  const canGoForward = computed(() => historyIndex.value < history.value.length - 1)

  /**
   * Navigate to a specific path
   * @param {string} path - Target path
   * @param {Object} [options] - Options
   * @param {boolean} [options.addToHistory] - Whether to add to history
   * @returns {string} Normalized path
   */
  function navigateTo(path, { addToHistory = true } = {}) {
    // Normalize path
    const normalizedPath = normalizePath(path)

    if (normalizedPath === currentPath.value) {
      return normalizedPath
    }

    currentPath.value = normalizedPath

    if (addToHistory) {
      // Truncate forward history
      history.value = history.value.slice(0, historyIndex.value + 1)
      history.value.push(normalizedPath)

      // Limit history length
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
   * Navigate to the parent directory
   */
  function navigateToParent() {
    if (!isRoot.value) {
      return navigateTo(parentPath.value)
    }
    return currentPath.value
  }

  /**
   * Navigate via breadcrumb
   * @param {import('../types.js').BreadcrumbItem} item - Breadcrumb item
   */
  function navigateByBreadcrumb(item) {
    const index = currentPath.value.indexOf(item.value)
    if (index !== -1) {
      const newPath = currentPath.value.slice(0, index + item.value.length)
      return navigateTo(newPath.startsWith('/') ? newPath : `/${newPath}`)
    }
    return currentPath.value
  }

  /** Go back */
  function goBack() {
    if (canGoBack.value) {
      historyIndex.value--
      currentPath.value = history.value[historyIndex.value]
    }
    return currentPath.value
  }

  /** Go forward */
  function goForward() {
    if (canGoForward.value) {
      historyIndex.value++
      currentPath.value = history.value[historyIndex.value]
    }
    return currentPath.value
  }

  /** Reset to initial path */
  function reset() {
    currentPath.value = initialPath
    history.value = [initialPath]
    historyIndex.value = 0
  }

  /**
   * Normalize path
   * @param {string} path - Original path
   * @returns {string} Normalized path
   */
  function normalizePath(path) {
    // Ensure it starts with /
    let normalized = path.startsWith('/') ? path : `/${path}`
    // Remove trailing / (unless root)
    if (normalized.length > 1 && normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1)
    }
    // Handle consecutive /
    normalized = normalized.replace(/\/+/g, '/')
    return normalized
  }

  /**
   * Join paths
   * @param {...string} paths - Path segments
   * @returns {string} Joined path
   */
  function joinPath(...paths) {
    return normalizePath(paths.join('/'))
  }

  /**
   * Get basename (file or folder name) of a path
   * @param {string} path - Path
   * @returns {string} Basename
   */
  function getBasename(path) {
    const segments = path.split('/').filter(Boolean)
    return segments[segments.length - 1] || ''
  }

  /**
   * Get the directory part of a path
   * @param {string} path - Path
   * @returns {string} Directory path
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
