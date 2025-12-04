/**
 * @fileoverview 文件预览模块
 * 封装文件预览功能，支持不同文件类型的预览
 * 使用安全的 API，不依赖未暴露的 Node 模块
 */

import '../types.js'

/** @type {typeof window.adb} */
const $adb = window.adb

/**
 * 文件预览 Hook
 * @param {Object} options - 配置选项
 * @param {import('vue').Ref<string>} options.deviceId - 设备 ID
 * @returns {Object} 预览器实例
 */
export function useFilePreview({ deviceId }) {
  /** @type {import('vue').Ref<boolean>} 预览中状态 */
  const previewing = ref(false)

  /** @type {import('vue').Ref<string|null>} 错误信息 */
  const error = ref(null)

  /** @type {import('vue').Ref<string|null>} 当前预览文件路径 */
  const currentPreviewFile = ref(null)

  /** @type {Object|null} 当前下载器实例 */
  let downloaderInstance = null

  /**
   * 支持预览的文件类型配置
   * 可扩展以支持更多文件类型
   */
  const PREVIEW_SUPPORT = {
    // 文本文件
    text: {
      extensions: ['.txt', '.md', '.log', '.json', '.xml', '.yml', '.yaml', '.ini', '.conf', '.cfg'],
      maxSize: 10 * 1024 * 1024, // 10MB
    },
    // 图片文件
    image: {
      extensions: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.ico'],
      maxSize: 50 * 1024 * 1024, // 50MB
    },
    // 视频文件
    video: {
      extensions: ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm'],
      maxSize: 500 * 1024 * 1024, // 500MB
    },
    // 音频文件
    audio: {
      extensions: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a'],
      maxSize: 100 * 1024 * 1024, // 100MB
    },
    // 文档文件
    document: {
      extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'],
      maxSize: 100 * 1024 * 1024, // 100MB
    },
    // 代码文件
    code: {
      extensions: ['.js', '.ts', '.py', '.java', '.c', '.cpp', '.h', '.go', '.rs', '.vue', '.jsx', '.tsx', '.html', '.css', '.scss'],
      maxSize: 10 * 1024 * 1024, // 10MB
    },
  }

  /**
   * 获取文件扩展名
   * @param {string} filename - 文件名
   * @returns {string}
   */
  function getFileExtension(filename) {
    const lastDotIndex = filename.lastIndexOf('.')
    if (lastDotIndex === -1)
      return ''
    return filename.substring(lastDotIndex).toLowerCase()
  }

  /**
   * 检查文件是否支持预览
   * @param {import('../types.js').FileEntry} file - 文件项
   * @returns {Object} { supported: boolean, type: string, reason: string }
   */
  function checkPreviewSupport(file) {
    if (file.type === 'directory' || file.isDirectory) {
      return { supported: false, type: null, reason: 'Cannot preview directories' }
    }

    const ext = getFileExtension(file.name)
    if (!ext) {
      return { supported: false, type: null, reason: 'Unknown file type' }
    }

    // 查找支持的文件类型
    for (const [type, config] of Object.entries(PREVIEW_SUPPORT)) {
      if (config.extensions.includes(ext)) {
        // 检查文件大小（如果有）
        if (file.size && file.size > config.maxSize) {
          return {
            supported: false,
            type,
            reason: `File too large (max ${Math.round(config.maxSize / 1024 / 1024)}MB)`,
          }
        }
        return { supported: true, type, reason: null }
      }
    }

    // 默认尝试预览（让系统决定）
    return { supported: true, type: 'unknown', reason: null }
  }

  /**
   * 预览文件
   * @param {import('../types.js').FileEntry} file - 要预览的文件
   * @param {Object} [options] - 选项
   * @param {Function} [options.onProgress] - 进度回调
   * @returns {Promise<import('../types.js').OperationResult>}
   */
  async function previewFile(file, options = {}) {
    const { onProgress } = options

    if (!deviceId.value) {
      return { success: false, error: 'Device ID is required' }
    }

    // 检查是否支持预览
    const supportCheck = checkPreviewSupport(file)
    if (!supportCheck.supported) {
      return { success: false, error: supportCheck.reason }
    }

    previewing.value = true
    error.value = null

    try {
      // 获取临时目录
      const tempDir = await window.electron.ipcRenderer.invoke('get-temp-path')

      // 生成唯一文件名（添加时间戳避免冲突）
      const timestamp = Date.now()
      const fileName = file.name
      const fileExt = getFileExtension(fileName)
      const fileBaseName = fileExt
        ? fileName.substring(0, fileName.lastIndexOf('.'))
        : fileName
      const uniqueFileName = `${fileBaseName}_${timestamp}${fileExt}`
      const tempFilePath = window.nodePath.join(tempDir, uniqueFileName)

      // 转换为下载器需要的格式
      const downloadItem = {
        id: file.id,
        type: file.type || 'file',
        name: fileName,
      }

      // 创建下载器
      downloaderInstance = $adb.downloader({
        deviceId: deviceId.value,
        items: [downloadItem],
        localPath: tempDir,
        onProgress: (progressData) => {
          onProgress?.(progressData)
        },
      })

      // 执行下载
      const downloadResult = await downloaderInstance.start()

      if (!downloadResult.success) {
        return {
          success: false,
          error: downloadResult.error || 'Download failed',
        }
      }

      // 构建下载后的文件路径
      const downloadedPath = window.nodePath.join(tempDir, fileName)

      // 使用 IPC 调用重命名文件（如果需要）
      let finalPath = downloadedPath
      if (fileName !== uniqueFileName) {
        try {
          // 通过 IPC 调用主进程进行文件重命名
          await window.electron.ipcRenderer.invoke('rename-temp-file', {
            oldPath: downloadedPath,
            newPath: tempFilePath,
          })
          finalPath = tempFilePath
        }
        catch (renameError) {
          // 如果重命名失败，使用原文件名
          console.warn('Failed to rename temp file:', renameError)
          finalPath = downloadedPath
        }
      }

      // 使用系统默认应用打开文件（通过 IPC 调用）
      const openResult = await window.electron.ipcRenderer.invoke('open-path', finalPath)

      if (openResult) {
        // openPath 返回非空字符串表示出错
        return {
          success: false,
          error: openResult,
        }
      }

      currentPreviewFile.value = finalPath

      return {
        success: true,
        data: {
          filePath: finalPath,
          fileType: supportCheck.type,
        },
      }
    }
    catch (err) {
      error.value = err.message
      console.error('Preview failed:', err)
      return { success: false, error: err.message }
    }
    finally {
      previewing.value = false
      downloaderInstance = null
    }
  }

  /**
   * 取消预览（取消下载）
   */
  function cancel() {
    if (downloaderInstance) {
      downloaderInstance.cancel()
      downloaderInstance = null
    }
    previewing.value = false
  }

  /**
   * 重置状态
   */
  function reset() {
    cancel()
    error.value = null
    currentPreviewFile.value = null
  }

  return {
    // 状态
    previewing: readonly(previewing),
    error: readonly(error),
    currentPreviewFile: readonly(currentPreviewFile),

    // 方法
    previewFile,
    checkPreviewSupport,
    cancel,
    reset,

    // 配置（只读）
    PREVIEW_SUPPORT: readonly(PREVIEW_SUPPORT),
  }
}

export default useFilePreview
