/**
 * @fileoverview Download module
 * Encapsulates file/folder download functionality with progress, cancel and batch support
 */

import '../types.js'

/** @type {typeof window.$preload.adb} */
const $adb = window.$preload.adb

/**
 * Download hook
 * @param {Object} options - Options
 * @param {import('vue').Ref<string>} options.deviceId - Device ID
 * @returns {Object} Downloader instance
 */
export function useDownloader({ deviceId }) {
  /** @type {import('vue').Ref<boolean>} Downloading state */
  const downloading = ref(false)

  /** @type {import('vue').Ref<boolean>} Scanning state */
  const scanning = ref(false)

  /** @type {import('vue').Ref<import('../types.js').ProgressInfo|null>} Download progress */
  const progress = ref(null)

  /** @type {import('vue').Ref<string|null>} Error message */
  const error = ref(null)

  /** @type {import('vue').Ref<Object|null>} Download result */
  const result = ref(null)

  /** @type {Object|null} Current downloader instance */
  let downloaderInstance = null

  /**
   * Download files or folders
   * @param {import('../types.js').FileEntry|import('../types.js').FileEntry[]} items - Items to download
   * @param {Object} [options] - Options
   * @param {string} options.savePath - Local save path
   * @param {Function} [options.onProgress] - Progress callback
   * @param {Function} [options.onScanProgress] - Scan progress callback
   * @param {Function} [options.onError] - Error callback
   * @param {Function} [options.onItemStart] - Item start callback
   * @param {Function} [options.onItemComplete] - Item complete callback
   * @returns {Promise<import('../types.js').OperationResult>}
   */
  async function download(items, options = {}) {
    const {
      savePath,
      onProgress: externalOnProgress,
      onScanProgress: externalOnScanProgress,
      onError: externalOnError,
      onItemStart,
      onItemComplete,
      ...downloaderOptions
    } = options

    if (!deviceId.value) {
      return { success: false, error: 'Device ID is required' }
    }

    if (!savePath) {
      return { success: false, error: 'Save path is required' }
    }

    const itemArray = Array.isArray(items) ? items : [items]
    if (itemArray.length === 0) {
      return { success: false, error: 'No items to download' }
    }

    // Convert to downloader required format
    const downloadItems = itemArray.map(item => ({
      id: item.id,
      type: item.type,
      name: item.name,
    }))

    downloading.value = true
    scanning.value = true
    error.value = null
    result.value = null
    progress.value = { percent: 0, completed: 0, total: 0 }

    try {
      // Scan progress callback
      const onScanProgress = ({ filesFound, currentPath }) => {
        progress.value = {
          ...progress.value,
          total: filesFound,
          currentFile: currentPath,
        }
        externalOnScanProgress?.({ filesFound, currentPath })
      }

      // Progress callback
      const onProgress = (progressData) => {
        scanning.value = false
        if (progressData.total) {
          progress.value = {
            percent: progressData.total.percent || 0,
            completed: progressData.total.completedFiles || 0,
            total: progressData.total.files || 0,
            bytes: progressData.total.downloaded || 0,
            totalBytes: progressData.total.size || 0,
            elapsed: progressData.total.elapsed || 0,
            currentFile: progressData.file?.path,
          }
        }
        externalOnProgress?.(progressData)
      }

      // Error callback
      const onError = (err, filePath) => {
        console.warn(`Download error for ${filePath}:`, err?.message || err)
        externalOnError?.(err, filePath)
      }

      // Create downloader
      downloaderInstance = $adb.downloader({
        deviceId: deviceId.value,
        items: downloadItems,
        localPath: savePath,
        onProgress,
        onScanProgress,
        onError,
        onItemStart,
        onItemComplete,
        ...downloaderOptions,
      })

      // Start download
      const downloadResult = await downloaderInstance.start()
      result.value = downloadResult

      return {
        ...downloadResult,
        stats: downloadResult.stats,
        success: downloadResult.success,
        error: downloadResult.error,
        cancelled: downloadResult.cancelled,
      }
    }
    catch (err) {
      error.value = err.message
      console.error('Download failed:', err)
      return { success: false, error: err.message }
    }
    finally {
      downloading.value = false
      scanning.value = false
      downloaderInstance = null
    }
  }

  /**
   * Preview download job (does not perform actual download)
   * @param {import('../types.js').FileEntry|import('../types.js').FileEntry[]} items - Items to preview
   * @returns {Promise<Object>} Preview info
   */
  async function preview(items) {
    if (!deviceId.value) {
      return { success: false, error: 'Device ID is required' }
    }

    const itemArray = Array.isArray(items) ? items : [items]
    const downloadItems = itemArray.map(item => ({
      id: item.id,
      type: item.type,
      name: item.name,
    }))

    try {
      const previewInstance = $adb.downloader({
        deviceId: deviceId.value,
        items: downloadItems,
        localPath: './', // Temporary path, not actually used
      })

      return await previewInstance.preview()
    }
    catch (err) {
      return { success: false, error: err.message }
    }
  }
  /**
   * Select save path and download
   * @param {import('../types.js').FileEntry|import('../types.js').FileEntry[]} items - Items to download
   * @param {Object} [options] - Options
   * @returns {Promise<import('../types.js').OperationResult>}
   */
  async function selectAndDownload(items, options = {}) {
    try {
      const savePath = await window.$preload.ipcRenderer.invoke('show-open-dialog', {
        properties: ['openDirectory', 'createDirectory'],
        title: 'Select Save Location',
      })

      if (!savePath || savePath.length === 0) {
        return { success: false, error: 'No save path selected' }
      }

      return download(items, { ...options, savePath: savePath[0] })
    }
    catch (err) {
      return { success: false, error: err.message }
    }
  }

  /**
   * Cancel download
   */
  function cancel() {
    if (downloaderInstance) {
      downloaderInstance.cancel()
      downloaderInstance = null
    }
    downloading.value = false
    scanning.value = false
  }

  /**
   * Reset state
   */
  function reset() {
    cancel()
    progress.value = null
    error.value = null
    result.value = null
  }

  /**
   * Get download status summary
   * @returns {Object} Status summary
   */
  function getStatusSummary() {
    return {
      isActive: downloading.value || scanning.value,
      isScanning: scanning.value,
      isDownloading: downloading.value && !scanning.value,
      hasError: !!error.value,
      progress: progress.value,
      result: result.value,
    }
  }

  return {
    // State
    downloading: readonly(downloading),
    scanning: readonly(scanning),
    progress: readonly(progress),
    error: readonly(error),
    result: readonly(result),

    // Methods
    download,
    selectAndDownload,
    preview,
    cancel,
    reset,
    getStatusSummary,
  }
}

export default useDownloader
