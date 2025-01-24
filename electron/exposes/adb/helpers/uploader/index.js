import fs from 'fs-extra'
import path from 'node:path'

export class ADBUploader {
  constructor(options = {}) {
    this.adb = options.adb
    this.options = {
      onProgress: () => {},
      onDirectoryStart: () => {},
      onDirectoryComplete: () => {},
      onFileStart: () => {},
      onFileComplete: () => {},
      onError: () => {},
      onCancel: () => {},
      retries: 3,
      filter: null, // File filter function
      validateFile: null, // File validation function
      ...options,
    }
    this.isCancelled = false

    this.stats = {
      totalBytes: 0,
      uploadedBytes: 0,
      startTime: 0,
    }

    this._lastBytes = 0
  }

  /**
   * 取消当前上传操作
   */
  cancel() {
    this.isCancelled = true
    this.options.onCancel()
  }

  /**
   * Checks if a device is connected and ready
   * @returns {Promise<boolean>} True if device is ready
   */
  async isDeviceReady() {
    try {
      const devices = await this.adb.listDevices()
      return devices.length > 0
    }
    catch (error) {
      console.error('Error checking device:', error)
      return false
    }
  }

  async uploadTo(remoteDir, localPaths, deviceId = null) {
    this.isCancelled = false
    this.stats = {
      totalBytes: 0,
      uploadedBytes: 0,
      startTime: Date.now(),
    }

    try {
      const paths = Array.isArray(localPaths) ? localPaths : [localPaths]

      // Preprocessing: calculates the total size and validates the file
      for (const localPath of paths) {
        if (await fs.pathExists(localPath)) {
          const stats = await fs.stat(localPath)
          if (stats.isDirectory()) {
            const files = await this._getFileList(localPath)
            this.stats.totalBytes += files.reduce((acc, file) => acc + file.size, 0)
          }
          else {
            this.stats.totalBytes += stats.size
          }
        }
      }

      // Validate device
      const devices = await this.adb.listDevices()
      if (devices.length === 0) {
        throw new Error('No devices connected')
      }

      const device = deviceId
        ? this.adb.getDevice(deviceId)
        : this.adb.getDevice(devices[0].id)

      // Validate paths
      for (const path of paths) {
        if (!await fs.pathExists(path)) {
          throw new Error(`Local path does not exist: ${path}`)
        }
      }

      const results = []
      let sync = null

      try {
        sync = await device.syncService()

        for (const localPath of paths) {
          if (this.isCancelled)
            break

          try {
            const stats = await fs.stat(localPath)
            const isDirectory = stats.isDirectory()
            const name = path.basename(localPath)
            const targetRemotePath = path.posix.join(remoteDir, name)

            // 目录或文件开始上传回调
            this.options.onDirectoryStart(localPath, {
              isDirectory,
              ...this.stats,
            })

            const success = isDirectory
              ? await this._uploadSingleDirectory(sync, localPath, targetRemotePath)
              : await this._uploadSingleFile(sync, localPath, targetRemotePath)

            results.push({ localPath, success })

            this.options.onDirectoryComplete(localPath, success, {
              isDirectory,
              ...this.stats,
              duration: Date.now() - this.stats.startTime,
            })
          }
          catch (error) {
            results.push({
              localPath,
              success: false,
              error: error.message,
            })
            this.options.onError(error, localPath)
          }
        }

        return {
          success: results.every(r => r.success),
          results,
          stats: {
            ...this.stats,
            duration: Date.now() - this.stats.startTime,
          },
        }
      }
      finally {
        if (sync)
          await sync.end()
      }
    }
    catch (error) {
      console.error('Upload failed:', error)
      return {
        success: false,
        error: error.message,
        results: [],
        stats: {
          ...this.stats,
          duration: Date.now() - this.stats.startTime,
        },
      }
    }
  }

  async _uploadSingleFile(sync, localPath, remotePath) {
    if (this.options.validateFile) {
      await this.options.validateFile(localPath)
    }

    this.options.onFileStart(localPath, this.stats)
    await this._uploadFileWithRetry(sync, localPath, remotePath)
    this.options.onFileComplete(localPath, this.stats)
    return true
  }

  async _uploadSingleDirectory(sync, localDir, remoteDir) {
    const files = await this._getFileList(localDir)

    for (const file of files) {
      if (this.isCancelled)
        break

      if (this.options.filter && !this.options.filter(file.localPath)) {
        continue
      }

      const remotePath = path.posix.join(remoteDir, file.relativePath)
      await this._uploadSingleFile(sync, file.localPath, remotePath)
    }
    return true
  }

  async _getFileList(baseDir) {
    const files = await fs.readdir(baseDir)
    const fileList = []

    for (const file of files) {
      if (this.isCancelled)
        break

      const fullPath = path.join(baseDir, file)
      const stat = await fs.stat(fullPath)

      if (stat.isDirectory()) {
        const nestedFiles = await this._getFileList(fullPath)
        fileList.push(...nestedFiles.map(f => ({
          ...f,
          relativePath: path.posix.join(file, f.relativePath),
        })))
      }
      else {
        fileList.push({
          localPath: fullPath,
          relativePath: file,
          size: stat.size,
        })
      }
    }

    return fileList
  }

  async _uploadFileWithRetry(sync, localPath, remotePath) {
    let lastError = null

    for (let attempt = 0; attempt < this.options.retries; attempt++) {
      if (this.isCancelled)
        break

      try {
        await new Promise((resolve, reject) => {
          const fileSize = fs.statSync(localPath).size
          const transfer = sync.pushFile(localPath, remotePath)

          transfer.on('end', resolve)
          transfer.on('error', reject)

          transfer.on('progress', (progressStats) => {
            const bytesTransferred = progressStats.bytesTransferred
            const deltaBytes = bytesTransferred - (this._lastBytes || 0)
            this.stats.uploadedBytes += deltaBytes
            this._lastBytes = bytesTransferred

            this.options.onProgress({
              file: {
                path: localPath,
                size: fileSize,
                uploaded: bytesTransferred,
                percent: Math.round((bytesTransferred / fileSize) * 100),
              },
              total: {
                size: this.stats.totalBytes,
                uploaded: this.stats.uploadedBytes,
                percent: Math.round((this.stats.uploadedBytes / this.stats.totalBytes) * 100),
                elapsed: Date.now() - this.stats.startTime,
              },
            })
          })
        })

        this._lastBytes = 0
        return
      }
      catch (error) {
        lastError = error
        this.options.onError(error, localPath)

        if (attempt < this.options.retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 2 ** attempt * 1000))
        }
      }
    }

    throw lastError || new Error('Upload failed after retries')
  }
}

export default ADBUploader
