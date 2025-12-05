/**
 * @fileoverview 上传模块
 * 封装文件/文件夹上传功能，支持进度、取消、错误处理
 */

import '../types.js'

/** @type {typeof window.adb} */
const $adb = window.adb

/**
 * 上传 Hook
 * @param {Object} options - 配置选项
 * @param {import('vue').Ref<string>} options.deviceId - 设备 ID
 * @param {import('vue').Ref<string>} options.currentPath - 当前路径
 * @param {Function} [options.onRefresh] - 刷新回调
 * @returns {Object} 上传器实例
 */
export function useUploader({ deviceId, currentPath, onRefresh }) {
  /** @type {import('vue').Ref<boolean>} 上传中状态 */
  const uploading = ref(false)

  /** @type {import('vue').Ref<boolean>} 扫描中状态 */
  const scanning = ref(false)

  /** @type {import('vue').Ref<import('../types.js').ProgressInfo|null>} 上传进度 */
  const progress = ref(null)

  /** @type {import('vue').Ref<string|null>} 错误信息 */
  const error = ref(null)

  /** @type {import('vue').Ref<Object|null>} 上传结果 */
  const result = ref(null)

  /** @type {Object|null} 当前上传器实例 */
  let uploaderInstance = null

  /**
   * 选择文件并上传
   * @param {Object} [options] - 选项
   * @param {'openFile'|'openDirectory'} [options.openType] - 打开类型
   * @param {string} [options.remotePath] - 远程路径（默认使用当前路径）
   * @param {boolean} [options.autoRefresh] - 是否自动刷新
   * @returns {Promise<import('../types.js').OperationResult>}
   */
  async function selectAndUpload(options = {}) {
    const {
      openType = 'openFile',
      remotePath,
      autoRefresh = true,
      ...uploaderOptions
    } = options

    try {
      // 选择文件
      const files = await window.electron.ipcRenderer.invoke('show-open-dialog', {
        properties: [openType, 'multiSelections'],
        filters: [{ name: 'All Files', extensions: ['*'] }],
      })

      if (!files || files.length === 0) {
        return { success: false, error: 'No files selected' }
      }

      return upload(files, { remotePath, autoRefresh, ...uploaderOptions })
    }
    catch (err) {
      const message = err.message?.match(/Error: (.*)/)?.[1] || err.message
      return { success: false, error: message }
    }
  }

  /**
   * 上传文件
   * @param {string|string[]} localPaths - 本地文件路径
   * @param {Object} [options] - 选项
   * @param {string} [options.remotePath] - 远程路径
   * @param {boolean} [options.autoRefresh] - 是否自动刷新
   * @param {Function} [options.onProgress] - 进度回调
   * @param {Function} [options.onScanProgress] - 扫描进度回调
   * @param {Function} [options.onError] - 错误回调
   * @param {Function} [options.onFileStart] - 文件开始回调
   * @param {Function} [options.onFileComplete] - 文件完成回调
   * @returns {Promise<import('../types.js').OperationResult>}
   */
  async function upload(localPaths, options = {}) {
    const {
      remotePath = currentPath.value,
      autoRefresh = true,
      onProgress: externalOnProgress,
      onScanProgress: externalOnScanProgress,
      onError: externalOnError,
      onFileStart: externalOnFileStart,
      onFileComplete: externalOnFileComplete,
      ...uploaderOptions
    } = options

    if (!deviceId.value) {
      return { success: false, error: 'Device ID is required' }
    }

    const paths = Array.isArray(localPaths) ? localPaths : [localPaths]
    if (paths.length === 0) {
      return { success: false, error: 'No files to upload' }
    }

    uploading.value = true
    scanning.value = true
    error.value = null
    progress.value = { percent: 0, completed: 0, total: 0, currentFile: null }

    try {
      // 扫描进度回调
      const onScanProgress = (scanData) => {
        scanning.value = true
        externalOnScanProgress?.(scanData)
      }

      // 进度回调
      const onProgress = (progressData) => {
        scanning.value = false
        progress.value = {
          percent: progressData.total?.percent || 0,
          completed: progressData.total?.uploaded || 0,
          total: progressData.total?.size || 0,
          bytes: progressData.total?.uploaded || 0,
          totalBytes: progressData.total?.size || 0,
          elapsed: progressData.total?.elapsed || 0,
          currentFile: progressData.file?.path,
        }
        externalOnProgress?.(progressData)
      }

      // 文件开始回调
      const onFileStart = (file, stats) => {
        progress.value = {
          ...progress.value,
          currentFile: file,
        }
        externalOnFileStart?.(file, stats)
      }

      // 文件完成回调
      const onFileComplete = (file, stats) => {
        externalOnFileComplete?.(file, stats)
      }

      // 错误回调
      const onError = (err, file) => {
        console.warn(`Upload error for ${file}:`, err)
        externalOnError?.(err, file)
      }

      // 创建上传器
      uploaderInstance = $adb.uploader({
        deviceId: deviceId.value,
        localPaths: paths,
        remotePath,
        onProgress,
        onScanProgress,
        onFileStart,
        onFileComplete,
        onError,
        ...uploaderOptions,
      })

      // 执行上传
      const uploadResult = await uploaderInstance.start()
      result.value = uploadResult

      if (autoRefresh && onRefresh) {
        await onRefresh()
      }

      return {
        success: uploadResult.success,
        data: uploadResult,
        error: uploadResult.error,
        cancelled: uploadResult.cancelled,
        stats: uploadResult.stats,
      }
    }
    catch (err) {
      error.value = err.message
      console.error('Upload failed:', err)
      return { success: false, error: err.message }
    }
    finally {
      uploading.value = false
      scanning.value = false
      uploaderInstance = null
    }
  }

  /**
   * 取消上传
   */
  function cancel() {
    if (uploaderInstance) {
      uploaderInstance.cancel()
      uploaderInstance = null
    }
    uploading.value = false
  }

  /**
   * 重置状态
   */
  function reset() {
    cancel()
    progress.value = null
    error.value = null
    result.value = null
    scanning.value = false
  }

  /**
   * 获取状态摘要
   * @returns {Object}
   */
  function getStatusSummary() {
    return {
      uploading: uploading.value,
      scanning: scanning.value,
      progress: progress.value,
      error: error.value,
      result: result.value,
    }
  }

  return {
    // 状态
    uploading: readonly(uploading),
    scanning: readonly(scanning),
    progress: readonly(progress),
    error: readonly(error),
    result: readonly(result),

    // 方法
    selectAndUpload,
    upload,
    cancel,
    reset,
    getStatusSummary,
  }
}

export default useUploader
