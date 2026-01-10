/**
 * @fileoverview File preview module
 * Encapsulates file preview functionality and supports multiple file types
 * Uses safe APIs and does not rely on unexposed Node modules
 */

import '../types.js'

/** @type {typeof window.adb} */
const $adb = window.adb

/**
 * File preview hook
 * @param {Object} options - Configuration options
 * @param {import('vue').Ref<string>} options.deviceId - Device ID
 * @returns {Object} Previewer instance
 */
export function useFilePreview({ deviceId }) {
  /** @type {import('vue').Ref<boolean>} Previewing state */
  const previewing = ref(false)

  /** @type {import('vue').Ref<string|null>} Error message */
  const error = ref(null)

  /** @type {import('vue').Ref<string|null>} Current preview file path */
  const currentPreviewFile = ref(null)

  /** @type {Object|null} Current downloader instance */
  let downloaderInstance = null

  /**
   * Supported preview file types configuration
   * Extendable to support more file types
   */
  const PREVIEW_SUPPORT = {
    // Text files
    text: {
      extensions: ['.txt', '.md', '.log', '.json', '.xml', '.yml', '.yaml', '.ini', '.conf', '.cfg'],
      maxSize: 10 * 1024 * 1024, // 10MB
    },
    // Image files
    image: {
      extensions: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.ico'],
      maxSize: 50 * 1024 * 1024, // 50MB
    },
    // Video files
    video: {
      extensions: ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm'],
      maxSize: 500 * 1024 * 1024, // 500MB
    },
    // Audio files
    audio: {
      extensions: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a'],
      maxSize: 100 * 1024 * 1024, // 100MB
    },
    // Document files
    document: {
      extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'],
      maxSize: 100 * 1024 * 1024, // 100MB
    },
    // Code files
    code: {
      extensions: ['.js', '.ts', '.py', '.java', '.c', '.cpp', '.h', '.go', '.rs', '.vue', '.jsx', '.tsx', '.html', '.css', '.scss'],
      maxSize: 10 * 1024 * 1024, // 10MB
    },
  }

  /**
   * Get file extension
   * @param {string} filename - Filename
   * @returns {string}
   */
  function getFileExtension(filename) {
    const lastDotIndex = filename.lastIndexOf('.')
    if (lastDotIndex === -1)
      return ''
    return filename.substring(lastDotIndex).toLowerCase()
  }

  /**
   * Check if file is supported for preview
   * @param {import('../types.js').FileEntry} file - File entry
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

    // Find supported file types
    for (const [type, config] of Object.entries(PREVIEW_SUPPORT)) {
      if (config.extensions.includes(ext)) {
        // Check file size (if present)
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

    // Default to attempt preview (let system decide)
    return { supported: true, type: 'unknown', reason: null }
  }

  /**
   * Preview file
   * @param {import('../types.js').FileEntry} file - File to preview
   * @param {Object} [options] - Options
   * @param {Function} [options.onProgress] - Progress callback
   * @returns {Promise<import('../types.js').OperationResult>}
   */
  async function previewFile(file, options = {}) {
    const { onProgress } = options

    if (!deviceId.value) {
      return { success: false, error: 'Device ID is required' }
    }

    // Check preview support
    const supportCheck = checkPreviewSupport(file)
    if (!supportCheck.supported) {
      return { success: false, error: supportCheck.reason }
    }

    previewing.value = true
    error.value = null

    try {
      // Get temp directory
      const tempDir = await window.electron.ipcRenderer.invoke('get-temp-path')

      // Generate unique filename (append timestamp to avoid collisions)
      const timestamp = Date.now()
      const fileName = file.name
      const fileExt = getFileExtension(fileName)
      const fileBaseName = fileExt
        ? fileName.substring(0, fileName.lastIndexOf('.'))
        : fileName
      const uniqueFileName = `${fileBaseName}_${timestamp}${fileExt}`
      const tempFilePath = window.nodePath.join(tempDir, uniqueFileName)

      // Convert to downloader format
      const downloadItem = {
        id: file.id,
        type: file.type || 'file',
        name: fileName,
      }

      // Create downloader
      downloaderInstance = $adb.downloader({
        deviceId: deviceId.value,
        items: [downloadItem],
        localPath: tempDir,
        onProgress: (progressData) => {
          onProgress?.(progressData)
        },
      })

      // Start download
      const downloadResult = await downloaderInstance.start()

      if (!downloadResult.success) {
        return {
          success: false,
          error: downloadResult.error || 'Download failed',
        }
      }

      // Build downloaded file path
      const downloadedPath = window.nodePath.join(tempDir, fileName)

      // Rename file via IPC if necessary
      let finalPath = downloadedPath
      if (fileName !== uniqueFileName) {
        try {
          // Use IPC to call main process for file rename
          await window.electron.ipcRenderer.invoke('rename-temp-file', {
            oldPath: downloadedPath,
            newPath: tempFilePath,
          })
          finalPath = tempFilePath
        }
        catch (renameError) {
          // If rename fails, keep original filename
          console.warn('Failed to rename temp file:', renameError)
          finalPath = downloadedPath
        }
      }

      // Open file with system default app (via IPC)
      const openResult = await window.electron.ipcRenderer.invoke('open-path', finalPath)

      if (openResult) {
        // openPath returns a non-empty string on error
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
   * Cancel preview (cancel download)
   */
  function cancel() {
    if (downloaderInstance) {
      downloaderInstance.cancel()
      downloaderInstance = null
    }
    previewing.value = false
  }

  /**
   * Reset state
   */
  function reset() {
    cancel()
    error.value = null
    currentPreviewFile.value = null
  }

  return {
    // State
    previewing: readonly(previewing),
    error: readonly(error),
    currentPreviewFile: readonly(currentPreviewFile),

    // Methods
    previewFile,
    checkPreviewSupport,
    cancel,
    reset,

    // Config (readonly)
    PREVIEW_SUPPORT: readonly(PREVIEW_SUPPORT),
  }
}

export default useFilePreview
