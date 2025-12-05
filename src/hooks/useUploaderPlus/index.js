/**
 * @fileoverview ADB 批量上传 Hook
 * 基于最新的 ADBUploader 模块重构，支持扫描进度、详细统计、取消机制等
 * 优化版本：提供详细的设备进度跟踪、结果展示、重试功能等
 */

import { allSettledWrapper } from '$/utils'

/**
 * 设备上传状态枚举
 */
export const UPLOAD_STATUS = {
  PENDING: 'pending', // 等待中
  SCANNING: 'scanning', // 扫描中
  UPLOADING: 'uploading', // 上传中
  SUCCESS: 'success', // 成功
  FAILED: 'failed', // 失败
  CANCELLED: 'cancelled', // 已取消
}

/**
 * ADB 批量上传 Hook
 * 提供单设备和多设备文件上传功能
 * @returns {Object} 文件操作实例
 */
export function useUploaderPlus() {
  const deviceStore = useDeviceStore()

  /** @type {import('vue').Ref<boolean>} 加载状态（向后兼容） */
  const loading = ref(false)

  /** @type {import('vue').Ref<boolean>} 扫描状态 */
  const scanning = ref(false)

  /** @type {import('vue').Ref<Object|null>} 进度信息 */
  const progress = ref(null)

  /** @type {import('vue').Ref<string|null>} 错误信息 */
  const error = ref(null)

  /** @type {import('vue').Ref<Object|null>} 上传结果 */
  const result = ref(null)

  /** @type {import('vue').Ref<Map<string, Object>>} 设备进度映射（设备ID -> 进度信息） */
  const deviceProgress = ref(new Map())

  /** @type {import('vue').Ref<Map<string, Object>>} 设备状态映射（设备ID -> 状态信息） */
  const deviceStatus = ref(new Map())

  /** @type {Map<string, Object>} 活跃的上传器实例映射（设备ID -> 上传器） */
  const activeUploaders = new Map()

  /**
   * 发送文件到设备（单个或多个）
   * @param {Object|Object[]} devices - 设备或设备列表
   * @param {Object} [options] - 选项
   * @param {string[]} [options.localPaths] - 本地文件路径
   * @param {string} [options.remotePath] - 远程路径
   * @param {string} [options.properties] - 打开文件对话框属性
   * @param {boolean} [options.silent] - 静默模式
   * @returns {Promise<boolean|Object>}
   */
  async function upload(devices, options = {}) {
    if (!options.localPaths) {
      try {
        options.localPaths = await selectFiles({ properties: options.properties })
      }
      catch (err) {
        ElMessage.warning(err.message)
        return false
      }
    }

    if (Array.isArray(devices)) {
      return multipleUpload(devices, options)
    }

    return singleUpload(devices, options)
  }

  /**
   * 单设备上传
   * @param {Object} device - 设备对象
   * @param {Object} [options] - 选项
   * @returns {Promise<Object>}
   */
  async function singleUpload(device, options = {}) {
    options.remotePath = options.remotePath || options.savePath

    const {
      remotePath,
      silent = false,
      openType = 'openFile',
      localPaths,
      onProgress: externalOnProgress,
      onScanProgress: externalOnScanProgress,
      onError: externalOnError,
      onFileStart: externalOnFileStart,
      onFileComplete: externalOnFileComplete,
      onDirectoryStart: externalOnDirectoryStart,
      onDirectoryComplete: externalOnDirectoryComplete,
      ...uploaderOptions
    } = options

    loading.value = true
    scanning.value = true
    error.value = null
    progress.value = { percent: 0, completed: 0, total: 0, currentFile: null }

    let messageLoading
    const deviceLabel = deviceStore.getLabel(device)
    const messageText = `${deviceLabel}: ${window.t('device.control.file.push.loading')}`

    // 扫描进度回调
    const onScanProgress = (scanData) => {
      scanning.value = true
      if (!silent) {
        messageLoading?.update?.(`${messageText} (${window.t('common.scanning')}...)`)
      }
      externalOnScanProgress?.(scanData)
    }

    // 上传进度回调
    const onProgress = (progressData) => {
      scanning.value = false
      const percent = progressData.total?.percent || 0
      progress.value = {
        percent,
        completed: progressData.total?.uploaded || 0,
        total: progressData.total?.size || 0,
        bytes: progressData.total?.uploaded || 0,
        totalBytes: progressData.total?.size || 0,
        elapsed: progressData.total?.elapsed || 0,
        currentFile: progressData.file?.path,
      }

      if (!silent) {
        messageLoading?.update?.(`${messageText} (${percent}%)`)
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

    // 目录开始回调
    const onDirectoryStart = (dir, info) => {
      externalOnDirectoryStart?.(dir, info)
    }

    // 目录完成回调
    const onDirectoryComplete = (dir, success, info) => {
      externalOnDirectoryComplete?.(dir, success, info)
    }

    // 错误回调
    const onError = (err, file) => {
      console.warn(`Upload error for ${file}:`, err)
      externalOnError?.(err, file)
    }

    // 创建上传器
    const uploader = window.adb.uploader({
      deviceId: device.id,
      localPaths,
      remotePath,
      onProgress,
      onScanProgress,
      onFileStart,
      onFileComplete,
      onDirectoryStart,
      onDirectoryComplete,
      onError,
      ...uploaderOptions,
    })

    // 保存上传器实例
    activeUploaders.set(device.id, uploader)

    if (!silent) {
      messageLoading = useMessageLoading(messageText, {
        showClose: true,
        onCancel: () => {
          uploader.cancel()
        },
      })
    }

    try {
      const res = await uploader.start()
      result.value = res

      const totalCount = res.results?.length || 0
      const successCount = res.results?.filter(item => item.success).length || 0
      const failCount = totalCount - successCount

      if (!silent) {
        if (res.cancelled) {
          ElMessage.info(window.t('common.cancelled'))
        }
        else if (failCount > 0) {
          ElMessage.success(
            window.t('device.control.file.push.success', {
              deviceName: deviceLabel,
              totalCount,
              successCount,
              failCount,
            }),
          )
        }
        else {
          ElMessage.success(
            window.t('device.control.file.push.success.single', {
              deviceName: deviceLabel,
            }),
          )
        }
      }

      return {
        success: res.success,
        data: res,
        error: res.error,
        cancelled: res.cancelled,
        stats: res.stats,
      }
    }
    catch (err) {
      error.value = err.message
      console.error('Upload failed:', err)
      if (!silent) {
        ElMessage.warning(err.message)
      }
      return { success: false, error: err.message }
    }
    finally {
      loading.value = false
      scanning.value = false
      messageLoading?.close?.()
      activeUploaders.delete(device.id)
    }
  }

  /**
   * 多设备批量上传
   * @param {Object[]} devices - 设备列表
   * @param {Object} [options] - 选项
   * @returns {Promise<Object>}
   */
  async function multipleUpload(devices, options = {}) {
    loading.value = true
    scanning.value = true
    error.value = null
    progress.value = { percent: 0, completed: 0, total: 0 }

    // 初始化设备进度和状态
    deviceProgress.value = new Map()
    deviceStatus.value = new Map()

    devices.forEach((device) => {
      const deviceId = device.id
      deviceProgress.value.set(deviceId, {
        percent: 0,
        completed: 0,
        total: 0,
        currentFile: null,
        filesScanned: 0,
        filesCompleted: 0,
        filesSuccess: 0,
        filesFailed: 0,
      })
      deviceStatus.value.set(deviceId, {
        status: UPLOAD_STATUS.PENDING,
        deviceLabel: deviceStore.getLabel(device),
        error: null,
        startTime: null,
        endTime: null,
      })
    })

    const messageText = window.t('device.control.file.upload.batch.loading')
    const totalDevices = devices.length
    let completedDevices = 0
    let scanningDevices = 0

    // 用于取消所有上传
    let cancelFlag = false

    const messageLoading = useMessageLoading(messageText, {
      showClose: true,
      onCancel: async () => {
        const confirmed = await ElMessageBox.confirm(
          window.t('device.control.file.upload.cancel.confirm'),
          window.t('common.tips'),
          {
            confirmButtonText: window.t('common.confirm'),
            cancelButtonText: window.t('common.cancel'),
            type: 'warning',
          },
        ).catch(() => false)

        if (confirmed) {
          cancelFlag = true
          // 取消所有活跃的上传器
          activeUploaders.forEach((uploader) => {
            uploader.cancel()
          })
          // 更新所有未完成设备的状态为已取消
          deviceStatus.value.forEach((status, deviceId) => {
            if (status.status === UPLOAD_STATUS.PENDING || status.status === UPLOAD_STATUS.SCANNING || status.status === UPLOAD_STATUS.UPLOADING) {
              status.status = UPLOAD_STATUS.CANCELLED
              status.endTime = Date.now()
            }
          })
        }
      },
    })

    // 聚合统计信息
    const aggregatedStats = {
      totalFiles: 0,
      completedFiles: 0,
      successFiles: 0,
      failedFiles: 0,
      totalBytes: 0,
      uploadedBytes: 0,
    }

    // 失败原因统计
    const errorStats = new Map()

    // 设备进度回调
    const onDeviceProgress = (deviceId, progressData) => {
      if (cancelFlag)
        return

      const deviceProgressData = deviceProgress.value.get(deviceId)
      if (deviceProgressData) {
        deviceProgressData.percent = progressData?.total?.percent || 0
        deviceProgressData.completed = progressData?.total?.uploaded || 0
        deviceProgressData.total = progressData?.total?.size || 0
        deviceProgressData.currentFile = progressData?.file?.path || null
      }

      // 更新设备状态为上传中
      const deviceStatusData = deviceStatus.value.get(deviceId)
      if (deviceStatusData && deviceStatusData.status === UPLOAD_STATUS.SCANNING) {
        deviceStatusData.status = UPLOAD_STATUS.UPLOADING
      }

      // 计算总体进度
      const percent = progressData?.total?.percent || 0
      const deviceWeight = 1 / totalDevices
      const currentProgress = ((completedDevices / totalDevices) + (percent / 100 * deviceWeight)) * 100

      progress.value = {
        percent: Math.floor(currentProgress),
        completed: aggregatedStats.uploadedBytes,
        total: aggregatedStats.totalBytes,
      }

      messageLoading.update(`${messageText} (${Math.floor(currentProgress)}%)`)
    }

    // 设备扫描进度回调
    const onDeviceScanProgress = (deviceId, scanData) => {
      if (cancelFlag)
        return

      const deviceProgressData = deviceProgress.value.get(deviceId)
      if (deviceProgressData) {
        deviceProgressData.filesScanned = scanData?.filesFound || 0
      }

      // 更新设备状态为扫描中
      const deviceStatusData = deviceStatus.value.get(deviceId)
      if (deviceStatusData && deviceStatusData.status === UPLOAD_STATUS.PENDING) {
        deviceStatusData.status = UPLOAD_STATUS.SCANNING
        deviceStatusData.startTime = Date.now()
      }

      scanning.value = scanningDevices > 0
      messageLoading.update(`${messageText} (${window.t('common.scanning')}...)`)
    }

    // 执行批量上传
    const results = await allSettledWrapper(devices, async (device, index) => {
      if (cancelFlag) {
        return { success: false, cancelled: true, device: device.id }
      }

      scanningDevices++

      try {
        const res = await singleUpload(device, {
          ...options,
          silent: true,
          onProgress: (progressData) => {
            onDeviceProgress(device.id, progressData)
            options.onProgress?.(progressData)
          },
          onScanProgress: (scanData) => {
            onDeviceScanProgress(device.id, scanData)
            options.onScanProgress?.(scanData)
          },
          onError: (err, file) => {
            // 统计失败原因
            const errorKey = err.message || 'Unknown error'
            errorStats.set(errorKey, (errorStats.get(errorKey) || 0) + 1)
            options.onError?.(err, file)
          },
        })

        scanningDevices--

        // 更新设备进度
        const deviceProgressData = deviceProgress.value.get(device.id)
        if (deviceProgressData && res.stats) {
          deviceProgressData.filesCompleted = res.stats.completedFiles || 0
          deviceProgressData.filesSuccess = res.stats.successFiles || 0
          deviceProgressData.filesFailed = res.stats.failedFiles || 0
        }

        // 更新设备状态
        const deviceStatusData = deviceStatus.value.get(device.id)
        if (deviceStatusData) {
          deviceStatusData.status = res.success ? UPLOAD_STATUS.SUCCESS : UPLOAD_STATUS.FAILED
          deviceStatusData.error = res.error || null
          deviceStatusData.endTime = Date.now()
        }

        // 聚合统计
        if (res.stats) {
          aggregatedStats.totalFiles += res.stats.totalFiles || 0
          aggregatedStats.completedFiles += res.stats.completedFiles || 0
          aggregatedStats.successFiles += res.stats.successFiles || 0
          aggregatedStats.failedFiles += res.stats.failedFiles || 0
          aggregatedStats.totalBytes += res.stats.totalBytes || 0
          aggregatedStats.uploadedBytes += res.stats.uploadedBytes || 0
        }

        completedDevices++
        onDeviceProgress(device.id, { total: { percent: 100 } })

        return { ...res, device: device.id }
      }
      catch (err) {
        scanningDevices--
        completedDevices++

        // 更新设备状态为失败
        const deviceStatusData = deviceStatus.value.get(device.id)
        if (deviceStatusData) {
          deviceStatusData.status = UPLOAD_STATUS.FAILED
          deviceStatusData.error = err.message
          deviceStatusData.endTime = Date.now()
        }

        // 统计失败原因
        const errorKey = err.message || 'Unknown error'
        errorStats.set(errorKey, (errorStats.get(errorKey) || 0) + 1)

        console.error(`Upload failed for device ${device.id}:`, err)
        return { success: false, error: err.message, device: device.id }
      }
    })

    messageLoading.close()

    // 统计结果
    const successDevices = results.filter(r => r.value?.success).length
    const failedDevices = totalDevices - successDevices
    const cancelledDevices = results.filter(r => r.value?.cancelled).length

    // 转换失败原因统计为数组
    const errorStatsArray = Array.from(errorStats.entries()).map(([error, count]) => ({
      error,
      count,
    }))

    result.value = {
      success: successDevices === totalDevices,
      cancelled: cancelFlag,
      results,
      stats: aggregatedStats,
      errorStats: errorStatsArray,
      deviceProgress: Object.fromEntries(deviceProgress.value),
      deviceStatus: Object.fromEntries(deviceStatus.value),
      summary: {
        total: totalDevices,
        success: successDevices,
        failed: failedDevices,
        cancelled: cancelledDevices,
      },
    }

    // 显示结果消息
    if (!cancelFlag) {
      if (failedDevices > 0) {
        ElMessage.warning(
          window.t('device.control.file.upload.batch.partial.success', {
            total: totalDevices,
            success: successDevices,
            failed: failedDevices,
          }),
        )
      }
      else {
        ElMessage.success(window.t('device.control.file.upload.batch.success'))
      }
    }
    else {
      ElMessage.info(window.t('common.cancelled'))
    }

    loading.value = false
    scanning.value = false

    return result.value
  }

  /**
   * 重试失败的设备上传
   * @param {Object[]} failedDevices - 失败的设备列表
   * @param {Object} [options] - 选项
   * @returns {Promise<Object>}
   */
  async function retryFailedDevices(failedDevices, options = {}) {
    if (!failedDevices || failedDevices.length === 0) {
      ElMessage.warning(window.t('device.control.file.upload.retry.no.failed'))
      return { success: false, error: 'No failed devices to retry' }
    }

    return multipleUpload(failedDevices, options)
  }

  /**
   * 取消所有上传
   */
  function cancelAll() {
    activeUploaders.forEach((uploader) => {
      uploader.cancel()
    })
    activeUploaders.clear()
    loading.value = false
    scanning.value = false
  }

  /**
   * 重置状态
   */
  function reset() {
    cancelAll()
    progress.value = null
    error.value = null
    result.value = null
  }

  /**
   * 获取状态摘要
   * @returns {Object}
   */
  function getStatusSummary() {
    return {
      loading: loading.value,
      scanning: scanning.value,
      progress: progress.value,
      error: error.value,
      result: result.value,
      deviceProgress: Object.fromEntries(deviceProgress.value),
      deviceStatus: Object.fromEntries(deviceStatus.value),
      activeUploaders: activeUploaders.size,
    }
  }

  /**
   * 获取设备进度
   * @param {string} deviceId - 设备ID
   * @returns {Object|null}
   */
  function getDeviceProgress(deviceId) {
    return deviceProgress.value.get(deviceId) || null
  }

  /**
   * 获取设备状态
   * @param {string} deviceId - 设备ID
   * @returns {Object|null}
   */
  function getDeviceStatus(deviceId) {
    return deviceStatus.value.get(deviceId) || null
  }

  return {
    // 状态
    loading: readonly(loading),
    scanning: readonly(scanning),
    progress: readonly(progress),
    error: readonly(error),
    result: readonly(result),
    deviceProgress: readonly(deviceProgress),
    deviceStatus: readonly(deviceStatus),

    // 方法
    upload,
    singleUpload,
    multipleUpload,
    retryFailedDevices,
    cancelAll,
    reset,
    getStatusSummary,
    getDeviceProgress,
    getDeviceStatus,

    // 常量
    UPLOAD_STATUS,
  }
}

/**
 * 选择文件对话框
 * @param {Object} [options] - 选项
 * @param {string[]} [options.properties] - 对话框属性
 * @returns {Promise<string[]>} 选中的文件路径列表
 */
export async function selectFiles(options = {}) {
  const { properties = ['openFile', 'openDirectory', 'multiSelections'] } = options

  try {
    const files = await window.electron.ipcRenderer.invoke(
      'show-open-dialog',
      {
        properties,
        filters: [
          {
            name: window.t('device.control.file.push.placeholder'),
            extensions: ['*'],
          },
        ],
      },
    )

    return files
  }
  catch (error) {
    const message = error.message?.match(/Error: (.*)/)?.[1] || error.message
    throw new Error(message)
  }
}
