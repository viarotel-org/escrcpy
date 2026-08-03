/**
 * @fileoverview ADB bulk upload hook
 * Rebuilt on top of the latest ADBUploader module, supporting scan progress, detailed stats, cancellations, etc.
 * Enhanced: provides detailed per-device progress tracking, result presentation, and retry capabilities
 */

import { allSettledWrapper } from '$/utils'

/**
 * Upload status enumeration
 */
export const UPLOAD_STATUS = {
  PENDING: 'pending', // Pending
  SCANNING: 'scanning', // Scanning
  UPLOADING: 'uploading', // Uploading
  SUCCESS: 'success', // Success
  FAILED: 'failed', // Failed
  CANCELLED: 'cancelled', // Cancelled
}

/**
 * ADB bulk upload hook
 * Provides single-device and multi-device file upload capabilities
 * @returns {Object} File operation instance
 */
export function useUploaderPlus() {
  const deviceStore = useDeviceStore()

  /** @type {import('vue').Ref<boolean>} Loading state (backwards compatible) */
  const loading = ref(false)

  /** @type {import('vue').Ref<boolean>} Scanning state */
  const scanning = ref(false)

  /** @type {import('vue').Ref<Object|null>} Progress information */
  const progress = ref(null)

  /** @type {import('vue').Ref<string|null>} Error information */
  const error = ref(null)

  /** @type {import('vue').Ref<Object|null>} Upload result */
  const result = ref(null)

  /** @type {import('vue').Ref<Map<string, Object>>} Device progress map (deviceId -> progress info) */
  const deviceProgress = ref(new Map())

  /** @type {import('vue').Ref<Map<string, Object>>} Device status map (deviceId -> status info) */
  const deviceStatus = ref(new Map())

  /** @type {Map<string, Object>} Active uploader instances map (deviceId -> uploader) */
  const activeUploaders = new Map()

  /**
   * Send files to device(s)
   * @param {Object|Object[]} devices - Device or list of devices
   * @param {Object} [options] - Options
   * @param {string[]} [options.localPaths] - Local file paths
   * @param {string} [options.remotePath] - Remote path
   * @param {string} [options.properties] - File dialog properties
   * @param {boolean} [options.silent] - Silent mode
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
   * Single-device upload
   * @param {Object} device - Device object
   * @param {Object} [options] - Options
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

    // Scan progress callback
    const onScanProgress = (scanData) => {
      scanning.value = true
      if (!silent) {
        messageLoading?.update?.(`${messageText} (${window.t('common.scanning')}...)`)
      }
      externalOnScanProgress?.(scanData)
    }

    // Upload progress callback
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

    // File start callback
    const onFileStart = (file, stats) => {
      progress.value = {
        ...progress.value,
        currentFile: file,
      }
      externalOnFileStart?.(file, stats)
    }

    // File complete callback
    const onFileComplete = (file, stats) => {
      externalOnFileComplete?.(file, stats)
    }

    // Directory start callback
    const onDirectoryStart = (dir, info) => {
      externalOnDirectoryStart?.(dir, info)
    }

    // Directory complete callback
    const onDirectoryComplete = (dir, success, info) => {
      externalOnDirectoryComplete?.(dir, success, info)
    }

    // Error callback
    const onError = (err, file) => {
      console.warn(`Upload error for ${file}:`, err)
      externalOnError?.(err, file)
    }

    // Create uploader
    const uploader = window.$preload.adb.uploader({
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

    // Store uploader instance
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
   * Multiple-device bulk upload
   * @param {Object[]} devices - Devices list
   * @param {Object} [options] - Options
   * @returns {Promise<Object>}
   */
  async function multipleUpload(devices, options = {}) {
    loading.value = true
    scanning.value = true
    error.value = null
    progress.value = { percent: 0, completed: 0, total: 0 }

    // Initialize device progress and status
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

    // Used to cancel all uploads
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
          // Cancel all active uploaders
          activeUploaders.forEach((uploader) => {
            uploader.cancel()
          })
          // Mark all unfinished devices as cancelled
          deviceStatus.value.forEach((status, deviceId) => {
            if (status.status === UPLOAD_STATUS.PENDING || status.status === UPLOAD_STATUS.SCANNING || status.status === UPLOAD_STATUS.UPLOADING) {
              status.status = UPLOAD_STATUS.CANCELLED
              status.endTime = Date.now()
            }
          })
        }
      },
    })

    // Aggregate statistics
    const aggregatedStats = {
      totalFiles: 0,
      completedFiles: 0,
      successFiles: 0,
      failedFiles: 0,
      totalBytes: 0,
      uploadedBytes: 0,
    }

    // Error statistics
    const errorStats = new Map()

    // Device progress callback
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

      // Update device status to uploading
      const deviceStatusData = deviceStatus.value.get(deviceId)
      if (deviceStatusData && deviceStatusData.status === UPLOAD_STATUS.SCANNING) {
        deviceStatusData.status = UPLOAD_STATUS.UPLOADING
      }

      // Compute overall progress
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

    // Device scan progress callback
    const onDeviceScanProgress = (deviceId, scanData) => {
      if (cancelFlag)
        return

      const deviceProgressData = deviceProgress.value.get(deviceId)
      if (deviceProgressData) {
        deviceProgressData.filesScanned = scanData?.filesFound || 0
      }

      // Update device status to scanning
      const deviceStatusData = deviceStatus.value.get(deviceId)
      if (deviceStatusData && deviceStatusData.status === UPLOAD_STATUS.PENDING) {
        deviceStatusData.status = UPLOAD_STATUS.SCANNING
        deviceStatusData.startTime = Date.now()
      }

      scanning.value = scanningDevices > 0
      messageLoading.update(`${messageText} (${window.t('common.scanning')}...)`)
    }

    // Perform bulk upload
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
            // Aggregate failure reasons
            const errorKey = err.message || 'Unknown error'
            errorStats.set(errorKey, (errorStats.get(errorKey) || 0) + 1)
            options.onError?.(err, file)
          },
        })

        scanningDevices--

        // Update device progress
        const deviceProgressData = deviceProgress.value.get(device.id)
        if (deviceProgressData && res.stats) {
          deviceProgressData.filesCompleted = res.stats.completedFiles || 0
          deviceProgressData.filesSuccess = res.stats.successFiles || 0
          deviceProgressData.filesFailed = res.stats.failedFiles || 0
        }

        // Update device status
        const deviceStatusData = deviceStatus.value.get(device.id)
        if (deviceStatusData) {
          deviceStatusData.status = res.success ? UPLOAD_STATUS.SUCCESS : UPLOAD_STATUS.FAILED
          deviceStatusData.error = res.error || null
          deviceStatusData.endTime = Date.now()
        }

        // Aggregate statistics
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

        // Mark device status as failed
        const deviceStatusData = deviceStatus.value.get(device.id)
        if (deviceStatusData) {
          deviceStatusData.status = UPLOAD_STATUS.FAILED
          deviceStatusData.error = err.message
          deviceStatusData.endTime = Date.now()
        }

        // Record failure reason
        const errorKey = err.message || 'Unknown error'
        errorStats.set(errorKey, (errorStats.get(errorKey) || 0) + 1)

        console.error(`Upload failed for device ${device.id}:`, err)
        return { success: false, error: err.message, device: device.id }
      }
    })

    messageLoading.close()

    // Summarize results
    const successDevices = results.filter(r => r.value?.success).length
    const failedDevices = totalDevices - successDevices
    const cancelledDevices = results.filter(r => r.value?.cancelled).length

    // Convert error stats map to array
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

    // Show result notifications
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
   * Retry uploads for failed devices
   * @param {Object[]} failedDevices - List of failed devices
   * @param {Object} [options] - Options
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
   * Cancel all uploads
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
   * Reset state
   */
  function reset() {
    cancelAll()
    progress.value = null
    error.value = null
    result.value = null
  }

  /**
   * Get status summary
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
   * Get device progress
   * @param {string} deviceId - Device ID
   * @returns {Object|null}
   */
  function getDeviceProgress(deviceId) {
    return deviceProgress.value.get(deviceId) || null
  }

  /**
   * Get device status
   * @param {string} deviceId - Device ID
   * @returns {Object|null}
   */
  function getDeviceStatus(deviceId) {
    return deviceStatus.value.get(deviceId) || null
  }

  return {
    // State
    loading: readonly(loading),
    scanning: readonly(scanning),
    progress: readonly(progress),
    error: readonly(error),
    result: readonly(result),
    deviceProgress: readonly(deviceProgress),
    deviceStatus: readonly(deviceStatus),

    // Methods
    upload,
    singleUpload,
    multipleUpload,
    retryFailedDevices,
    cancelAll,
    reset,
    getStatusSummary,
    getDeviceProgress,
    getDeviceStatus,

    // Constants
    UPLOAD_STATUS,
  }
}

/**
 * File selection dialog
 * @param {Object} [options] - Options
 * @param {string[]} [options.properties] - Dialog properties
 * @returns {Promise<string[]>} Selected file paths
 */
export async function selectFiles(options = {}) {
  const { properties = ['openFile', 'openDirectory', 'multiSelections'] } = options

  try {
    const files = await window.$preload.ipcRenderer.invoke(
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
