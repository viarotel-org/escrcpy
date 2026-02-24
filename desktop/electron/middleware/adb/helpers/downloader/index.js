import fs from 'fs-extra'
import path from 'node:path'
import { throttle } from 'lodash-es'
import { getFileSize } from '../index.js'

/**
 * ADB file/directory downloader
 * Supports recursive directory downloads, progress tracking, cancellation, and error handling
 */
export class ADBDownloader {
  constructor(options = {}) {
    this.adb = options.adb
    this.options = {
      onProgress: () => {},
      onItemStart: () => {},
      onItemComplete: () => {},
      onError: () => {},
      onCancel: () => {},
      onScanProgress: () => {},
      retries: 3,
      concurrency: 1, // Number of concurrent downloads (reserved for future use)
      ...options,
    }

    this.isCancelled = false

    this.options.onProgress = throttle(this.options.onProgress, 500)
    this.options.onScanProgress = throttle(this.options.onScanProgress, 500)

    // Download statistics
    this.stats = {
      totalFiles: 0,
      completedFiles: 0,
      failedFiles: 0,
      totalBytes: 0,
      downloadedBytes: 0,
      startTime: 0,
    }

    // Download task queue
    this.taskQueue = []
    // Failed task list
    this.failedTasks = []
    // File progress tracking map (key: remotePath, value: downloadedBytes)
    this.fileProgressMap = new Map()
  }

  /**
   * Cancel the current download operation
   */
  cancel() {
    this.isCancelled = true
    this.options.onCancel?.()
  }

  /**
   * Reset internal state
   */
  reset() {
    this.isCancelled = false
    this.stats = {
      totalFiles: 0,
      completedFiles: 0,
      failedFiles: 0,
      totalBytes: 0,
      downloadedBytes: 0,
      startTime: 0,
    }
    this.taskQueue = []
    this.failedTasks = []
    this.fileProgressMap.clear()
  }

  /**
   * Get accurate file size using stat command
   * @private
   * @param {object} device - ADB device object
   * @param {string} filePath - Remote file path
   * @returns {Promise<number>} File size in bytes
   */
  async _getAccurateFileSize(device, filePath) {
    return getFileSize(device, filePath)
  }

  /**
   * Recursively scan remote directory structure and build download task list
   * @param {string} deviceId - Device ID
   * @param {string} remotePath - Remote device path
   * @param {string} basePath - Base path (used to compute relative paths)
   * @returns {Promise<Array>} List of file tasks
   */
  async scanRemoteDirectory(deviceId, remotePath, basePath = null) {
    if (this.isCancelled)
      return []

    const effectiveBasePath = basePath || path.posix.dirname(remotePath)
    const tasks = []

    try {
      const device = this.adb.getDevice(deviceId)
      const entries = await device.readdir(remotePath)

      for (const entry of entries) {
        if (this.isCancelled)
          break

        const fullRemotePath = path.posix.join(remotePath, entry.name)
        const relativePath = path.posix.relative(effectiveBasePath, fullRemotePath)

        if (entry.isFile()) {
          // Get accurate file size using stat command
          const accurateSize = await this._getAccurateFileSize(device, fullRemotePath)

          tasks.push({
            type: 'file',
            remotePath: fullRemotePath,
            relativePath,
            name: entry.name,
            size: accurateSize,
          })

          // Scan progress callback
          this.options.onScanProgress?.({
            currentPath: fullRemotePath,
            filesFound: tasks.length,
          })
        }
        else if (entry.isDirectory()) {
          // Add directory task (used to create empty directory)
          tasks.push({
            type: 'directory',
            remotePath: fullRemotePath,
            relativePath,
            name: entry.name,
            size: 0,
          })

          // Recursively scan subdirectory
          const subTasks = await this.scanRemoteDirectory(deviceId, fullRemotePath, effectiveBasePath)
          tasks.push(...subTasks)
        }
      }
    }
    catch (error) {
      console.error(`Failed to scan directory ${remotePath}:`, error.message)
      this.options.onError?.(error, remotePath)
    }

    return tasks
  }

  /**
   * Check whether a remote path is a directory
   * @param {string} deviceId - Device ID
   * @param {string} remotePath - Remote device path
   * @returns {Promise<boolean>}
   */
  async isDirectory(deviceId, remotePath) {
    try {
      const device = this.adb.getDevice(deviceId)
      const parentPath = path.posix.dirname(remotePath)
      const name = path.posix.basename(remotePath)
      const entries = await device.readdir(parentPath)
      const entry = entries.find(e => e.name === name)
      return entry && !entry.isFile()
    }
    catch {
      return false
    }
  }

  /**
   * Get info for a single file or directory
   * @param {string} deviceId - Device ID
   * @param {string} remotePath - Remote device path
   * @returns {Promise<Object|null>}
   */
  async getFileInfo(deviceId, remotePath) {
    try {
      const device = this.adb.getDevice(deviceId)
      const parentPath = path.posix.dirname(remotePath)
      const name = path.posix.basename(remotePath)
      const entries = await device.readdir(parentPath)
      const entry = entries.find(e => e.name === name)

      if (!entry) {
        return null
      }

      // Get accurate file size for files
      const accurateSize = entry.isFile()
        ? await this._getAccurateFileSize(device, remotePath)
        : 0

      return { size: accurateSize, isFile: entry.isFile() }
    }
    catch {
      return null
    }
  }

  /**
   * Main download method: supports mixed files and directories
   * @param {string} deviceId - Device ID
   * @param {Array<Object>} items - List of items to download [{id: remotePath, type: 'file'|'directory', name}]
   * @param {string} localBasePath - Local base path for saving
   * @returns {Promise<Object>} Download result
   */
  async downloadTo(deviceId, items, localBasePath) {
    this.reset()
    this.stats.startTime = Date.now()

    try {
      // Ensure local save directory exists
      await fs.ensureDir(localBasePath)

      // Step 1: build the complete download task queue
      await this._buildTaskQueue(deviceId, items)

      if (this.isCancelled) {
        return this._buildResult(false, 'Download cancelled')
      }

      // Calculate total files and bytes
      this.stats.totalFiles = this.taskQueue.filter(t => t.type === 'file').length
      this.stats.totalBytes = this.taskQueue.reduce((sum, t) => sum + (t.size || 0), 0)

      // Step 2: execute download tasks
      await this._executeTaskQueue(deviceId, localBasePath)

      return this._buildResult(this.failedTasks.length === 0)
    }
    catch (error) {
      console.error('Download failed:', error)
      return this._buildResult(false, error.message)
    }
  }

  /**
   * Build the download task queue
   * @private
   */
  async _buildTaskQueue(deviceId, items) {
    for (const item of items) {
      if (this.isCancelled)
        break

      const remotePath = item.id
      const itemType = item.type

      if (itemType === 'directory') {
        // Scan directory and add the directory itself and all child items
        const dirName = path.posix.basename(remotePath)
        const parentPath = path.posix.dirname(remotePath)

        // Add root directory task
        this.taskQueue.push({
          type: 'directory',
          remotePath,
          relativePath: dirName,
          name: dirName,
          size: 0,
        })

        // Recursively scan and add child tasks
        const subTasks = await this.scanRemoteDirectory(deviceId, remotePath, parentPath)
        this.taskQueue.push(...subTasks)
      }
      else {
        // Single file
        const fileInfo = await this.getFileInfo(deviceId, remotePath)
        const fileName = path.posix.basename(remotePath)

        this.taskQueue.push({
          type: 'file',
          remotePath,
          relativePath: fileName,
          name: fileName,
          size: fileInfo?.size || 0,
        })
      }
    }
  }

  /**
   * Execute the download task queue
   * @private
   */
  async _executeTaskQueue(deviceId, localBasePath) {
    const device = this.adb.getDevice(deviceId)

    for (const task of this.taskQueue) {
      if (this.isCancelled)
        break

      const localPath = path.join(localBasePath, task.relativePath)

      try {
        this.options.onItemStart?.(task, { ...this.stats })

        if (task.type === 'directory') {
          // Create local directory (handles empty folders)
          await fs.ensureDir(localPath)
        }
        else {
          // Download file
          await this._downloadFileWithRetry(device, task, localPath)
          this.stats.completedFiles++
        }

        this.options.onItemComplete?.(task, true, { ...this.stats })
      }
      catch (error) {
        console.error(`Failed to download ${task.remotePath}:`, error.message)
        this.stats.failedFiles++
        this.failedTasks.push({ ...task, error: error.message })
        this.options.onError?.(error, task.remotePath)
        this.options.onItemComplete?.(task, false, { ...this.stats, error: error.message })
        // Continue with other files; do not abort the entire process
      }

      // Update overall progress after each task completion
      this._updateProgress()
    }
  }

  /**
   * File download with retries
   * @private
   */
  async _downloadFileWithRetry(device, task, localPath) {
    let lastError = null

    for (let attempt = 0; attempt < this.options.retries; attempt++) {
      if (this.isCancelled)
        break

      try {
        // Ensure parent directory exists
        await fs.ensureDir(path.dirname(localPath))

        await this._downloadSingleFile(device, task.remotePath, localPath, task.size)
        return
      }
      catch (error) {
        lastError = error
        console.warn(`Download attempt ${attempt + 1} failed for ${task.remotePath}:`, error.message)

        if (attempt < this.options.retries - 1) {
          // Exponential backoff retry
          await new Promise(resolve => setTimeout(resolve, 2 ** attempt * 1000))
        }
      }
    }

    throw lastError || new Error('Download failed after retries')
  }

  /**
   * Download a single file
   * @private
   */
  async _downloadSingleFile(device, remotePath, localPath, fileSize) {
    return new Promise((resolve, reject) => {
      // Initialize file progress tracking
      this.fileProgressMap.set(remotePath, 0)
      const fileStartBytes = this.stats.downloadedBytes

      device.pull(remotePath)
        .then((transfer) => {
          const writeStream = fs.createWriteStream(localPath)

          transfer.on('progress', (stats) => {
            // Use absolute bytesTransferred value from ADB
            const currentFileBytes = stats.bytesTransferred

            // Update file progress tracking
            this.fileProgressMap.set(remotePath, currentFileBytes)

            // Update global downloadedBytes: remove old file progress, add new progress
            this.stats.downloadedBytes = fileStartBytes + currentFileBytes

            // Calculate percentages with upper bound protection
            const filePercent = fileSize > 0
              ? Math.min(100, Math.round((currentFileBytes / fileSize) * 100))
              : 100

            const totalPercent = this.stats.totalBytes > 0
              ? Math.min(100, Math.round((this.stats.downloadedBytes / this.stats.totalBytes) * 100))
              : 0

            this.options.onProgress?.({
              file: {
                path: remotePath,
                localPath,
                size: fileSize,
                downloaded: currentFileBytes,
                percent: filePercent,
              },
              total: {
                files: this.stats.totalFiles,
                completedFiles: this.stats.completedFiles,
                size: this.stats.totalBytes,
                downloaded: this.stats.downloadedBytes,
                percent: totalPercent,
                elapsed: Date.now() - this.stats.startTime,
              },
            })
          })

          transfer.on('end', () => {
            writeStream.end()
            // Ensure final progress is set to file size (handles edge cases)
            this.fileProgressMap.set(remotePath, fileSize)
            this.stats.downloadedBytes = fileStartBytes + fileSize
            resolve()
          })

          transfer.on('error', (err) => {
            writeStream.destroy()
            // Clean up failed file and reset progress
            this.fileProgressMap.delete(remotePath)
            this.stats.downloadedBytes = fileStartBytes
            fs.unlink(localPath).catch(() => {})
            reject(err)
          })

          writeStream.on('error', (err) => {
            this.fileProgressMap.delete(remotePath)
            this.stats.downloadedBytes = fileStartBytes
            reject(err)
          })

          transfer.pipe(writeStream)
        })
        .catch((err) => {
          this.fileProgressMap.delete(remotePath)
          this.stats.downloadedBytes = fileStartBytes
          reject(err)
        })
    })
  }

  /**
   * Update overall progress
   * @private
   */
  _updateProgress() {
    const totalTasks = this.taskQueue.filter(t => t.type === 'file').length
    const completedTasks = this.stats.completedFiles + this.stats.failedFiles

    // Calculate progress percentage with upper bound protection
    const percentByCount = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100
    const percentByBytes = this.stats.totalBytes > 0
      ? Math.round((this.stats.downloadedBytes / this.stats.totalBytes) * 100)
      : 0

    // Use byte-based percentage as primary, with upper limit of 100%
    const finalPercent = Math.min(100, percentByBytes)

    this.options.onProgress?.({
      file: null,
      total: {
        files: totalTasks,
        completedFiles: this.stats.completedFiles,
        failedFiles: this.stats.failedFiles,
        size: this.stats.totalBytes,
        downloaded: this.stats.downloadedBytes,
        percent: finalPercent,
        elapsed: Date.now() - this.stats.startTime,
      },
    })
  }

  /**
   * Construct return result
   * @private
   */
  _buildResult(success, error = null) {
    return {
      success,
      error,
      cancelled: this.isCancelled,
      stats: {
        ...this.stats,
        duration: Date.now() - this.stats.startTime,
      },
      failedTasks: this.failedTasks,
      taskQueue: this.taskQueue,
    }
  }

  /**
   * Retrieve task preview information (does not perform downloads)
   * @param {string} deviceId - Device ID
   * @param {Array<Object>} items - List of items to preview
   * @returns {Promise<Object>} Task preview information
   */
  async previewTasks(deviceId, items) {
    this.reset()

    try {
      await this._buildTaskQueue(deviceId, items)

      const files = this.taskQueue.filter(t => t.type === 'file')
      const directories = this.taskQueue.filter(t => t.type === 'directory')

      return {
        success: true,
        totalFiles: files.length,
        totalDirectories: directories.length,
        totalBytes: files.reduce((sum, t) => sum + (t.size || 0), 0),
        tasks: this.taskQueue,
      }
    }
    catch (error) {
      return {
        success: false,
        error: error.message,
        totalFiles: 0,
        totalDirectories: 0,
        totalBytes: 0,
        tasks: [],
      }
    }
  }
}

export default ADBDownloader
