import fs from 'fs-extra'
import path from 'node:path'

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
          tasks.push({
            type: 'file',
            remotePath: fullRemotePath,
            relativePath,
            name: entry.name,
            size: entry.size || 0,
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
      return entry ? { size: entry.size || 0, isFile: entry.isFile() } : null
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

      // Update overall progress
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
      device.pull(remotePath)
        .then((transfer) => {
          const writeStream = fs.createWriteStream(localPath)

          let downloadedBytes = 0

          transfer.on('progress', (stats) => {
            const delta = stats.bytesTransferred - downloadedBytes
            downloadedBytes = stats.bytesTransferred
            this.stats.downloadedBytes += delta

            this.options.onProgress?.({
              file: {
                path: remotePath,
                localPath,
                size: fileSize,
                downloaded: downloadedBytes,
                percent: fileSize > 0 ? Math.round((downloadedBytes / fileSize) * 100) : 100,
              },
              total: {
                files: this.stats.totalFiles,
                completedFiles: this.stats.completedFiles,
                size: this.stats.totalBytes,
                downloaded: this.stats.downloadedBytes,
                percent: this.stats.totalBytes > 0
                  ? Math.round((this.stats.downloadedBytes / this.stats.totalBytes) * 100)
                  : 0,
                elapsed: Date.now() - this.stats.startTime,
              },
            })
          })

          transfer.on('end', () => {
            writeStream.end()
            resolve()
          })

          transfer.on('error', (err) => {
            writeStream.destroy()
            // Clean up failed file
            fs.unlink(localPath).catch(() => {})
            reject(err)
          })

          writeStream.on('error', (err) => {
            reject(err)
          })

          transfer.pipe(writeStream)
        })
        .catch(reject)
    })
  }

  /**
   * Update overall progress
   * @private
   */
  _updateProgress() {
    const totalTasks = this.taskQueue.filter(t => t.type === 'file').length
    const completedTasks = this.stats.completedFiles + this.stats.failedFiles

    this.options.onProgress?.({
      file: null,
      total: {
        files: totalTasks,
        completedFiles: this.stats.completedFiles,
        failedFiles: this.stats.failedFiles,
        size: this.stats.totalBytes,
        downloaded: this.stats.downloadedBytes,
        percent: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100,
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
