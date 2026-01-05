import fs from 'fs-extra'
import path from 'node:path'

/**
 * ADB 文件/文件夹下载器
 * 支持递归下载目录结构、进度追踪、取消任务、错误处理
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
      concurrency: 1, // 并发下载数（预留扩展）
      ...options,
    }
    this.isCancelled = false

    // 下载统计信息
    this.stats = {
      totalFiles: 0,
      completedFiles: 0,
      failedFiles: 0,
      totalBytes: 0,
      downloadedBytes: 0,
      startTime: 0,
    }

    // 下载任务队列
    this.taskQueue = []
    // 失败任务列表
    this.failedTasks = []
  }

  /**
   * 取消当前下载操作
   */
  cancel() {
    this.isCancelled = true
    this.options.onCancel?.()
  }

  /**
   * 重置状态
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
   * 递归扫描设备端目录结构，构建下载任务列表
   * @param {string} deviceId 设备ID
   * @param {string} remotePath 设备端路径
   * @param {string} basePath 基础路径（用于计算相对路径）
   * @returns {Promise<Array>} 文件任务列表
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

          // 扫描进度回调
          this.options.onScanProgress?.({
            currentPath: fullRemotePath,
            filesFound: tasks.length,
          })
        }
        else if (entry.isDirectory()) {
          // 添加目录任务（用于创建空目录）
          tasks.push({
            type: 'directory',
            remotePath: fullRemotePath,
            relativePath,
            name: entry.name,
            size: 0,
          })

          // 递归扫描子目录
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
   * 检查路径是否为目录
   * @param {string} deviceId 设备ID
   * @param {string} remotePath 设备端路径
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
   * 获取单个文件/目录的信息
   * @param {string} deviceId 设备ID
   * @param {string} remotePath 设备端路径
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
   * 主下载方法：支持文件和文件夹混合下载
   * @param {string} deviceId 设备ID
   * @param {Array<Object>} items 待下载项列表 [{id: remotePath, type: 'file'|'directory', name}]
   * @param {string} localBasePath 本地保存基础路径
   * @returns {Promise<Object>} 下载结果
   */
  async downloadTo(deviceId, items, localBasePath) {
    this.reset()
    this.stats.startTime = Date.now()

    try {
      // 确保本地保存目录存在
      await fs.ensureDir(localBasePath)

      // 第一步：构建完整的下载任务队列
      await this._buildTaskQueue(deviceId, items)

      if (this.isCancelled) {
        return this._buildResult(false, 'Download cancelled')
      }

      // 计算文件总大小
      this.stats.totalFiles = this.taskQueue.filter(t => t.type === 'file').length
      this.stats.totalBytes = this.taskQueue.reduce((sum, t) => sum + (t.size || 0), 0)

      // 第二步：执行下载任务
      await this._executeTaskQueue(deviceId, localBasePath)

      return this._buildResult(this.failedTasks.length === 0)
    }
    catch (error) {
      console.error('Download failed:', error)
      return this._buildResult(false, error.message)
    }
  }

  /**
   * 构建下载任务队列
   * @private
   */
  async _buildTaskQueue(deviceId, items) {
    for (const item of items) {
      if (this.isCancelled)
        break

      const remotePath = item.id
      const itemType = item.type

      if (itemType === 'directory') {
        // 扫描目录，添加目录本身和所有子项
        const dirName = path.posix.basename(remotePath)
        const parentPath = path.posix.dirname(remotePath)

        // 添加根目录任务
        this.taskQueue.push({
          type: 'directory',
          remotePath,
          relativePath: dirName,
          name: dirName,
          size: 0,
        })

        // 递归扫描并添加子任务
        const subTasks = await this.scanRemoteDirectory(deviceId, remotePath, parentPath)
        this.taskQueue.push(...subTasks)
      }
      else {
        // 单个文件
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
   * 执行下载任务队列
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
          // 创建本地目录（处理空文件夹情况）
          await fs.ensureDir(localPath)
        }
        else {
          // 下载文件
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
        // 继续下载其他文件，不中断整个流程
      }

      // 更新整体进度
      this._updateProgress()
    }
  }

  /**
   * 带重试的文件下载
   * @private
   */
  async _downloadFileWithRetry(device, task, localPath) {
    let lastError = null

    for (let attempt = 0; attempt < this.options.retries; attempt++) {
      if (this.isCancelled)
        break

      try {
        // 确保父目录存在
        await fs.ensureDir(path.dirname(localPath))

        await this._downloadSingleFile(device, task.remotePath, localPath, task.size)
        return
      }
      catch (error) {
        lastError = error
        console.warn(`Download attempt ${attempt + 1} failed for ${task.remotePath}:`, error.message)

        if (attempt < this.options.retries - 1) {
          // 指数退避重试
          await new Promise(resolve => setTimeout(resolve, 2 ** attempt * 1000))
        }
      }
    }

    throw lastError || new Error('Download failed after retries')
  }

  /**
   * 下载单个文件
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
            // 清理失败的文件
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
   * 更新整体进度
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
   * 构建返回结果
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
   * 获取任务预览信息（不执行下载）
   * @param {string} deviceId 设备ID
   * @param {Array<Object>} items 待下载项列表
   * @returns {Promise<Object>} 任务预览信息
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
