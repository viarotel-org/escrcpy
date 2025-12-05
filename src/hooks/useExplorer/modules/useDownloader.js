/**
 * @fileoverview 下载模块
 * 封装文件/文件夹下载功能，支持进度、取消、批量下载
 */

import '../types.js'

/** @type {typeof window.adb} */
const $adb = window.adb

/**
 * 下载 Hook
 * @param {Object} options - 配置选项
 * @param {import('vue').Ref<string>} options.deviceId - 设备 ID
 * @returns {Object} 下载器实例
 */
export function useDownloader({ deviceId }) {
  /** @type {import('vue').Ref<boolean>} 下载中状态 */
  const downloading = ref(false)

  /** @type {import('vue').Ref<boolean>} 扫描中状态 */
  const scanning = ref(false)

  /** @type {import('vue').Ref<import('../types.js').ProgressInfo|null>} 下载进度 */
  const progress = ref(null)

  /** @type {import('vue').Ref<string|null>} 错误信息 */
  const error = ref(null)

  /** @type {import('vue').Ref<Object|null>} 下载结果 */
  const result = ref(null)

  /** @type {Object|null} 当前下载器实例 */
  let downloaderInstance = null

  /**
   * 下载文件或文件夹
   * @param {import('../types.js').FileEntry|import('../types.js').FileEntry[]} items - 要下载的项
   * @param {Object} [options] - 选项
   * @param {string} options.savePath - 本地保存路径
   * @param {Function} [options.onProgress] - 进度回调
   * @param {Function} [options.onScanProgress] - 扫描进度回调
   * @param {Function} [options.onError] - 错误回调
   * @param {Function} [options.onItemStart] - 项目开始回调
   * @param {Function} [options.onItemComplete] - 项目完成回调
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

    // 转换为下载器需要的格式
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
      // 扫描进度回调
      const onScanProgress = ({ filesFound, currentPath }) => {
        progress.value = {
          ...progress.value,
          total: filesFound,
          currentFile: currentPath,
        }
        externalOnScanProgress?.({ filesFound, currentPath })
      }

      // 进度回调
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

      // 错误回调
      const onError = (err, filePath) => {
        console.warn(`Download error for ${filePath}:`, err?.message || err)
        externalOnError?.(err, filePath)
      }

      // 创建下载器
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

      // 执行下载
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
   * 预览下载任务（不执行实际下载）
   * @param {import('../types.js').FileEntry|import('../types.js').FileEntry[]} items - 要预览的项
   * @returns {Promise<Object>} 预览信息
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
        localPath: './', // 临时路径，不会实际使用
      })

      return await previewInstance.preview()
    }
    catch (err) {
      return { success: false, error: err.message }
    }
  }
  /**
   * 选择保存路径并下载
   * @param {import('../types.js').FileEntry|import('../types.js').FileEntry[]} items - 要下载的项
   * @param {Object} [options] - 选项
   * @returns {Promise<import('../types.js').OperationResult>}
   */
  async function selectAndDownload(items, options = {}) {
    try {
      const savePath = await window.electron.ipcRenderer.invoke('show-open-dialog', {
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
   * 取消下载
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
   * 重置状态
   */
  function reset() {
    cancel()
    progress.value = null
    error.value = null
    result.value = null
  }

  /**
   * 获取下载状态摘要
   * @returns {Object} 状态摘要
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
    // 状态
    downloading: readonly(downloading),
    scanning: readonly(scanning),
    progress: readonly(progress),
    error: readonly(error),
    result: readonly(result),

    // 方法
    download,
    selectAndDownload,
    preview,
    cancel,
    reset,
    getStatusSummary,
  }
}

export default useDownloader
