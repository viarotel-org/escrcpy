/**
 * @fileoverview ADB file manager Hook
 * Provides a full set of ADB file management features: browse, upload, download, and operations
 *
 * @example
 * ```js
 * const explorer = useExplorer({
 *   device: { id: 'device-id' },
 *   initialPath: '/sdcard',
 * })
 *
 * // Read directory
 * await explorer.refresh()
 *
 * // Navigate
 * explorer.navigateTo('/sdcard/Download')
 *
 * // Upload files
 * await explorer.upload.selectAndUpload()
 *
 * // Download selected items
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

  // ========== Device management ==========

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

  // ========== Path management ==========

  const pathManager = usePathManager(pathOptions)

  // ========== File operations ==========

  const fileOps = useFileOperations({
    deviceId,
    currentPath: pathManager.currentPath,
  })

  // ========== Uploader ==========

  const uploader = useUploader({
    deviceId,
    currentPath: pathManager.currentPath,
    onRefresh: () => fileOps.refresh(),
  })

  // ========== Downloader ==========

  const downloader = useDownloader({ deviceId })

  // ========== Previewer ==========

  const previewer = useFilePreview({ deviceId })

  // ========== Selection management ==========

  const selection = useSelection()

  // ========== Clipboard management ==========

  const clipboard = useFileClipboard()

  // ========== Auto-refresh ==========

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

  // Watch path changes and refresh automatically
  watch(
    () => pathManager.currentPath.value,
    async () => {
      if (deviceId.value) {
        selection.clearSelection()
        await fileOps.readDirectory()
      }
    },
  )

  // Cleanup on component unmount
  onUnmounted(() => {
    stopAutoRefresh()
    uploader.reset()
    downloader.reset()
    previewer.reset()
  })

  // Initialization
  if (autoRefresh) {
    startAutoRefresh()
  }

  // ========== Convenience methods ==========

  /**
   * Refresh current directory
   */
  async function refresh() {
    return fileOps.refresh()
  }

  /**
   * Navigate to path and refresh
   * @param {string} path - Target path
   */
  async function navigateTo(path) {
    pathManager.navigateTo(path)
    // Listener will trigger refresh automatically
  }

  /**
   * Enter subdirectory
   * @param {import('./types.js').FileEntry} item - Directory item
   */
  async function enterDirectory(item) {
    if (item.type === 'directory') {
      pathManager.navigateTo(item.id)
    }
  }

  /**
   * Go up to parent directory
   */
  async function goUp() {
    pathManager.navigateToParent()
  }
  /**
   * Get current status summary
   * @returns {Object} Status summary
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
   * Reset all states
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
   * Paste clipboard content to current directory
   * @param {Object} [options] - Options
   * @param {boolean} [options.autoRefresh] - Whether to auto-refresh
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
   * Initialize and load
   * @param {import('./types.js').DeviceInfo} [newDevice] - Optional new device
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
