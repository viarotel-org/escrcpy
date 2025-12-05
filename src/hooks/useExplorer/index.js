/**
 * @fileoverview ADB 文件管理器 Hook
 * 提供完整的 ADB 文件管理功能，包括浏览、上传、下载、操作等
 *
 * @example
 * ```js
 * const explorer = useExplorer({
 *   device: { id: 'device-id' },
 *   initialPath: '/sdcard',
 * })
 *
 * // 读取目录
 * await explorer.refresh()
 *
 * // 导航
 * explorer.navigateTo('/sdcard/Download')
 *
 * // 上传文件
 * await explorer.upload.selectAndUpload()
 *
 * // 下载选中项
 * await explorer.download.download(explorer.selection.selectedItems.value, {
 *   savePath: '/local/path',
 * })
 * ```
 */

import './types.js'
import {
  useDownloader,
  useFileClipboard,
  useFileOperations,
  useFilePreview,
  usePathManager,
  useSelection,
  useUploader,
} from './modules/index.js'

/**
 * ADB 文件管理器 Hook
 * @param {import('./types.js').ExplorerOptions} options - 配置选项
 * @returns {Object} 文件管理器实例
 */
export function useExplorer(options = {}) {
  const {
    device,
    pathOptions = {},
    autoRefresh = false,
    refreshInterval = 5000,
  } = options

  // ========== 设备管理 ==========

  /** @type {import('vue').Ref<string>} 设备 ID */
  const deviceId = ref(device?.id || '')

  /** @type {import('vue').Ref<import('./types.js').DeviceInfo|null>} 设备信息 */
  const deviceInfo = ref(device || null)

  /**
   * 设置设备
   * @param {import('./types.js').DeviceInfo} newDevice - 新设备
   */
  function setDevice(newDevice) {
    deviceId.value = newDevice?.id || ''
    deviceInfo.value = newDevice
  }

  // ========== 路径管理 ==========

  const pathManager = usePathManager(pathOptions)

  // ========== 文件操作 ==========

  const fileOps = useFileOperations({
    deviceId,
    currentPath: pathManager.currentPath,
  })

  // ========== 上传器 ==========

  const uploader = useUploader({
    deviceId,
    currentPath: pathManager.currentPath,
    onRefresh: () => fileOps.refresh(),
  })

  // ========== 下载器 ==========

  const downloader = useDownloader({ deviceId })

  // ========== 预览器 ==========

  const previewer = useFilePreview({ deviceId })

  // ========== 选择管理 ==========

  const selection = useSelection()

  // ========== 剪贴板管理 ==========

  const clipboard = useFileClipboard()

  // ========== 自动刷新 ==========

  let refreshTimer = null

  function startAutoRefresh() {
    if (refreshTimer)
      return
    refreshTimer = setInterval(() => {
      if (deviceId.value) {
        fileOps.refresh()
      }
    }, refreshInterval)
  }

  function stopAutoRefresh() {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }

  // 监听路径变化，自动刷新
  watch(
    () => pathManager.currentPath.value,
    async () => {
      if (deviceId.value) {
        selection.clearSelection()
        await fileOps.readDirectory()
      }
    },
  )

  // 组件卸载时清理
  onUnmounted(() => {
    stopAutoRefresh()
    uploader.reset()
    downloader.reset()
    previewer.reset()
  })

  // 初始化
  if (autoRefresh) {
    startAutoRefresh()
  }

  // ========== 便捷方法 ==========

  /**
   * 刷新当前目录
   */
  async function refresh() {
    return fileOps.refresh()
  }

  /**
   * 导航到路径并刷新
   * @param {string} path - 目标路径
   */
  async function navigateTo(path) {
    pathManager.navigateTo(path)
    // 监听器会自动触发刷新
  }

  /**
   * 进入子目录
   * @param {import('./types.js').FileEntry} item - 目录项
   */
  async function enterDirectory(item) {
    if (item.type === 'directory') {
      pathManager.navigateTo(item.id)
    }
  }

  /**
   * 返回上级目录
   */
  async function goUp() {
    pathManager.navigateToParent()
  }
  /**
   * 获取当前状态摘要
   * @returns {Object} 状态摘要
   */
  function getStatus() {
    return {
      device: deviceInfo.value,
      path: pathManager.currentPath.value,
      filesCount: fileOps.files.value.length,
      selectedCount: selection.selectionCount.value,
      isLoading: fileOps.loading.value,
      isUploading: uploader.uploading.value,
      isDownloading: downloader.downloading.value,
      hasError: !!fileOps.error.value,
    }
  }

  /**
   * 重置所有状态
   */
  function reset() {
    pathManager.reset()
    selection.clearSelection()
    clipboard.clear()
    uploader.reset()
    downloader.reset()
    previewer.reset()
  }

  /**
   * 粘贴剪贴板内容到当前目录
   * @param {Object} [options] - 选项
   * @param {boolean} [options.autoRefresh] - 是否自动刷新
   * @returns {Promise<import('./types.js').OperationResult>}
   */
  async function paste(options = {}) {
    if (!clipboard.hasClipboard.value) {
      return { success: false, error: 'Clipboard is empty' }
    }

    const items = clipboard.clipboardItems.value
    const targetPath = pathManager.currentPath.value
    const isCut = clipboard.isCutOperation.value

    let result
    if (isCut) {
      result = await fileOps.move(items, targetPath, options)
      if (result.success) {
        clipboard.clear()
      }
    }
    else {
      result = await fileOps.copy(items, targetPath, options)
    }

    return result
  }

  /**
   * 初始化并加载
   * @param {import('./types.js').DeviceInfo} [newDevice] - 可选的新设备
   */
  async function init(newDevice) {
    if (newDevice) {
      setDevice(newDevice)
    }
    if (deviceId.value) {
      await fileOps.readDirectory()
    }
  }

  return {
    // ========== 设备 ==========
    deviceId: readonly(deviceId),
    deviceInfo: readonly(deviceInfo),
    setDevice,

    // ========== 路径管理 ==========
    currentPath: pathManager.currentPath,
    breadcrumbs: pathManager.breadcrumbs,
    pathSegments: pathManager.pathSegments,
    parentPath: pathManager.parentPath,
    isRoot: pathManager.isRoot,
    canGoBack: pathManager.canGoBack,
    canGoForward: pathManager.canGoForward,
    goBack: pathManager.goBack,
    goForward: pathManager.goForward,
    navigateTo,
    navigateByBreadcrumb: pathManager.navigateByBreadcrumb,
    enterDirectory,
    goUp,

    // ========== 文件列表 ==========
    files: fileOps.files,
    loading: fileOps.loading,
    error: fileOps.error,
    lastRefreshTime: fileOps.lastRefreshTime,
    refresh,

    // ========== 文件操作 ==========
    operations: {
      createDirectory: fileOps.createDirectory,
      createFile: fileOps.createFile,
      remove: fileOps.remove,
      rename: fileOps.rename,
      copy: fileOps.copy,
      move: fileOps.move,
      exists: fileOps.exists,
      stat: fileOps.stat,
      readFile: fileOps.readFile,
      writeFile: fileOps.writeFile,
    },

    // ========== 上传 ==========
    uploader: {
      uploading: uploader.uploading,
      progress: uploader.progress,
      error: uploader.error,
      upload: uploader.upload,
      selectAndUpload: uploader.selectAndUpload,
      cancel: uploader.cancel,
      reset: uploader.reset,
    },

    // ========== 下载 ==========
    downloader: {
      downloading: downloader.downloading,
      scanning: downloader.scanning,
      progress: downloader.progress,
      error: downloader.error,
      result: downloader.result,
      download: downloader.download,
      selectAndDownload: downloader.selectAndDownload,
      preview: downloader.preview,
      cancel: downloader.cancel,
      reset: downloader.reset,
      getStatusSummary: downloader.getStatusSummary,
    },

    // ========== 预览 ==========
    previewer: {
      previewing: previewer.previewing,
      error: previewer.error,
      currentPreviewFile: previewer.currentPreviewFile,
      previewFile: previewer.previewFile,
      checkPreviewSupport: previewer.checkPreviewSupport,
      cancel: previewer.cancel,
      reset: previewer.reset,
      PREVIEW_SUPPORT: previewer.PREVIEW_SUPPORT,
    },

    // ========== 选择管理 ==========
    selection: {
      selectedItems: selection.selectedItems,
      selectionState: selection.selectionState,
      hasSelection: selection.hasSelection,
      selectionCount: selection.selectionCount,
      select: selection.select,
      deselect: selection.deselect,
      toggle: selection.toggle,
      isSelected: selection.isSelected,
      selectMultiple: selection.selectMultiple,
      deselectMultiple: selection.deselectMultiple,
      selectAll: () => selection.selectAll(fileOps.files.value),
      clearSelection: selection.clearSelection,
      setSelection: selection.setSelection,
      invertSelection: () => selection.invertSelection(fileOps.files.value),
      getSelectionByType: selection.getSelectionByType,
      onSelectionChange: selection.onSelectionChange,
    },

    // ========== 剪贴板 ==========
    clipboard: {
      clipboardItems: clipboard.clipboardItems,
      clipboardAction: clipboard.clipboardAction,
      clipboardState: clipboard.clipboardState,
      hasClipboard: clipboard.hasClipboard,
      isCutOperation: clipboard.isCutOperation,
      isCopyOperation: clipboard.isCopyOperation,
      sourcePath: clipboard.sourcePath,
      copy: items => clipboard.copy(items, pathManager.currentPath.value),
      cut: items => clipboard.cut(items, pathManager.currentPath.value),
      paste,
      clear: clipboard.clear,
      isInClipboard: clipboard.isInClipboard,
      isCut: clipboard.isCut,
    },

    // ========== 自动刷新 ==========
    startAutoRefresh,
    stopAutoRefresh,

    // ========== 工具方法 ==========
    path: {
      normalize: pathManager.normalizePath,
      join: pathManager.joinPath,
      basename: pathManager.getBasename,
      dirname: pathManager.getDirname,
    },

    // ========== 状态 & 生命周期 ==========
    getStatus,
    reset,
    init,

    // ========== 原始模块（高级用法） ==========
    _modules: {
      pathManager,
      fileOps,
      uploader,
      downloader,
      previewer,
      selection,
      clipboard,
    },
  }
}

export default useExplorer

// 导出子模块，允许独立使用
export * from './modules/index.js'
