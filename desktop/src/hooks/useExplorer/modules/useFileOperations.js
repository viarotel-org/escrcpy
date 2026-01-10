/**
 * @fileoverview File operations module
 * Encapsulates directory reading, create, delete, rename and other basic file operations
 */

import '../types.js'
import { decodeBase64, encodeBase64 } from '../helpers/index.js'

/** @type {typeof window.adb} */
const $adb = window.adb

/**
 * File operations hook
 * @param {Object} options - Configuration options
 * @param {import('vue').Ref<string>} options.deviceId - Device ID
 * @param {import('vue').Ref<string>} options.currentPath - Current path
 * @returns {Object} File operations instance
 */
export function useFileOperations({ deviceId, currentPath }) {
  /** @type {import('vue').Ref<boolean>} Loading state */
  const loading = ref(false)

  /** @type {import('vue').Ref<import('../types.js').FileEntry[]>} File list */
  const files = ref([])

  /** @type {import('vue').Ref<string|null>} 错误信息 */
  const error = ref(null)

  /** @type {import('vue').Ref<number>} Last refresh time */
  const lastRefreshTime = ref(0)

  /**
   * Read current directory
   * @returns {Promise<import('../types.js').FileEntry[]>}
   */
  async function readDirectory() {
    if (!deviceId.value) {
      error.value = 'Device ID is required'
      return []
    }

    loading.value = true
    error.value = null

    try {
      const data = await $adb.readdir(deviceId.value, currentPath.value)
      files.value = data
      lastRefreshTime.value = Date.now()
      return data
    }
    catch (err) {
      error.value = err.message || 'Failed to read directory'
      console.error('readDirectory error:', err)
      return []
    }
    finally {
      loading.value = false
    }
  }

  /**
   * 刷新当前目录
   * @returns {Promise<import('../types.js').FileEntry[]>}
   */
  async function refresh() {
    return readDirectory()
  }

  /**
   * Create directory
   * @param {string} dirname - Directory name
   * @param {Object} [options] - Options
   * @param {boolean} [options.autoRefresh] - Auto refresh
   * @returns {Promise<import('../types.js').OperationResult>}
   */
  async function createDirectory(dirname, { autoRefresh = true } = {}) {
    if (!deviceId.value) {
      return { success: false, error: 'Device ID is required' }
    }

    if (!dirname || dirname.includes('/')) {
      return { success: false, error: 'Invalid directory name' }
    }

    try {
      const fullPath = `${currentPath.value}/${dirname}`.replace(/\/+/g, '/')
      await $adb.deviceShell(deviceId.value, `mkdir -p "${fullPath}"`)

      if (autoRefresh) {
        await refresh()
      }

      return { success: true, data: { path: fullPath } }
    }
    catch (err) {
      console.error('createDirectory error:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Create empty file
   * @param {string} filename - Filename
   * @param {Object} [options] - Options
   * @param {boolean} [options.autoRefresh] - Auto refresh
   * @returns {Promise<import('../types.js').OperationResult>}
   */
  async function createFile(filename, { autoRefresh = true } = {}) {
    if (!deviceId.value) {
      return { success: false, error: 'Device ID is required' }
    }

    if (!filename || filename.includes('/')) {
      return { success: false, error: 'Invalid filename' }
    }

    try {
      const fullPath = `${currentPath.value}/${filename}`.replace(/\/+/g, '/')
      await $adb.deviceShell(deviceId.value, `touch "${fullPath}"`)

      if (autoRefresh) {
        await refresh()
      }

      return { success: true, data: { path: fullPath } }
    }
    catch (err) {
      console.error('createFile error:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Remove files or directories
   * @param {import('../types.js').FileEntry|import('../types.js').FileEntry[]} items - Items to remove
   * @param {Object} [options] - Options
   * @param {boolean} [options.autoRefresh] - Auto refresh
   * @param {boolean} [options.recursive] - Recursive delete
   * @returns {Promise<import('../types.js').OperationResult>}
   */
  async function remove(items, { autoRefresh = true, recursive = true } = {}) {
    if (!deviceId.value) {
      return { success: false, error: 'Device ID is required' }
    }

    const itemArray = Array.isArray(items) ? items : [items]
    if (itemArray.length === 0) {
      return { success: false, error: 'No items to delete' }
    }

    const results = { success: [], failed: [] }

    for (const item of itemArray) {
      try {
        const flag = recursive ? '-r' : ''
        await $adb.deviceShell(deviceId.value, `rm ${flag} "${item.id}"`)
        results.success.push(item)
      }
      catch (err) {
        console.error(`delete error for ${item.id}:`, err)
        results.failed.push({ item, error: err.message })
      }
    }

    if (autoRefresh) {
      await refresh()
    }

    return {
      success: results.failed.length === 0,
      data: results,
      error: results.failed.length > 0
        ? `Failed to delete ${results.failed.length} item(s)`
        : undefined,
    }
  }
  /**
   * 重命名文件或文件夹
   * @param {import('../types.js').FileEntry} item - 要重命名的项
   * @param {string} newName - 新名称
   * @param {Object} [options] - 选项
   * @param {boolean} [options.autoRefresh] - 是否自动刷新
   * @returns {Promise<import('../types.js').OperationResult>}
   */
  async function rename(item, newName, { autoRefresh = true } = {}) {
    if (!deviceId.value) {
      return { success: false, error: 'Device ID is required' }
    }

    if (!newName || newName.includes('/')) {
      return { success: false, error: 'Invalid name' }
    }

    try {
      const parentPath = item.id.substring(0, item.id.lastIndexOf('/'))
      const newPath = `${parentPath}/${newName}`.replace(/\/+/g, '/')
      await $adb.deviceShell(deviceId.value, `mv "${item.id}" "${newPath}"`)

      if (autoRefresh) {
        await refresh()
      }

      return { success: true, data: { oldPath: item.id, newPath } }
    }
    catch (err) {
      console.error('rename error:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Copy files or folders
   * @param {import('../types.js').FileEntry|import('../types.js').FileEntry[]} items - Items to copy
   * @param {string} targetPath - Target path
   * @param {Object} [options] - Options
   * @param {boolean} [options.autoRefresh] - Auto refresh
   * @returns {Promise<import('../types.js').OperationResult>}
   */
  async function copy(items, targetPath, { autoRefresh = true } = {}) {
    if (!deviceId.value) {
      return { success: false, error: 'Device ID is required' }
    }

    const itemArray = Array.isArray(items) ? items : [items]
    if (itemArray.length === 0) {
      return { success: false, error: 'No items to copy' }
    }

    const results = { success: [], failed: [] }

    for (const item of itemArray) {
      try {
        const flag = item.type === 'directory' ? '-r' : ''
        const destPath = `${targetPath}/${item.name}`.replace(/\/+/g, '/')
        await $adb.deviceShell(deviceId.value, `cp ${flag} "${item.id}" "${destPath}"`)
        results.success.push({ item, destPath })
      }
      catch (err) {
        console.error(`copy error for ${item.id}:`, err)
        results.failed.push({ item, error: err.message })
      }
    }

    if (autoRefresh) {
      await refresh()
    }

    return {
      success: results.failed.length === 0,
      data: results,
      error: results.failed.length > 0
        ? `Failed to copy ${results.failed.length} item(s)`
        : undefined,
    }
  }

  /**
   * 移动文件或文件夹
   * @param {import('../types.js').FileEntry|import('../types.js').FileEntry[]} items - 要移动的项
   * @param {string} targetPath - 目标路径
   * @param {Object} [options] - 选项
   * @param {boolean} [options.autoRefresh] - 是否自动刷新
   * @returns {Promise<import('../types.js').OperationResult>}
   */
  async function move(items, targetPath, { autoRefresh = true } = {}) {
    if (!deviceId.value) {
      return { success: false, error: 'Device ID is required' }
    }

    const itemArray = Array.isArray(items) ? items : [items]
    if (itemArray.length === 0) {
      return { success: false, error: 'No items to move' }
    }

    const results = { success: [], failed: [] }

    for (const item of itemArray) {
      try {
        const destPath = `${targetPath}/${item.name}`.replace(/\/+/g, '/')
        await $adb.deviceShell(deviceId.value, `mv "${item.id}" "${destPath}"`)
        results.success.push({ item, destPath })
      }
      catch (err) {
        console.error(`move error for ${item.id}:`, err)
        results.failed.push({ item, error: err.message })
      }
    }

    if (autoRefresh) {
      await refresh()
    }

    return {
      success: results.failed.length === 0,
      data: results,
      error: results.failed.length > 0
        ? `Failed to move ${results.failed.length} item(s)`
        : undefined,
    }
  }

  /**
   * 检查路径是否存在
   * @param {string} path - 路径
   * @returns {Promise<boolean>}
   */
  async function exists(path) {
    if (!deviceId.value)
      return false

    try {
      const result = await $adb.deviceShell(deviceId.value, `[ -e "${path}" ] && echo "exists"`)
      return result.trim() === 'exists'
    }
    catch {
      return false
    }
  }

  /**
   * 获取文件/文件夹信息
   * @param {string} path - 路径
   * @returns {Promise<Object|null>}
   */
  async function stat(path) {
    if (!deviceId.value)
      return null

    try {
      const result = await $adb.deviceShell(deviceId.value, `stat -c '%s %Y %F' "${path}"`)
      const [size, mtime, type] = result.trim().split(' ')
      return {
        size: Number.parseInt(size, 10),
        mtime: new Date(Number.parseInt(mtime, 10) * 1000),
        type: type.includes('directory') ? 'directory' : 'file',
      }
    }
    catch {
      return null
    }
  }

  /**
   * 读取文件内容
   * @param {string} filePath - 文件路径
   * @param {Object} [options] - 选项
   * @param {number} [options.maxSize] - 最大文件大小（字节），默认 1MB
   * @returns {Promise<import('../types.js').OperationResult>}
   */
  async function readFile(filePath, { maxSize = 1024 * 1024 } = {}) {
    if (!deviceId.value) {
      return { success: false, error: 'Device ID is required' }
    }

    try {
      // 先检查文件大小
      const fileStat = await stat(filePath)
      if (!fileStat) {
        return { success: false, error: 'File not found' }
      }

      if (fileStat.type === 'directory') {
        return { success: false, error: 'Cannot read directory as file' }
      }

      if (fileStat.size > maxSize) {
        return {
          success: false,
          error: 'FILE_TOO_LARGE',
          data: { size: fileStat.size, maxSize },
        }
      }

      // 使用 base64 编码读取文件内容，避免特殊字符问题
      const base64Content = await $adb.deviceShell(
        deviceId.value,
        `base64 "${filePath}"`,
      )

      // 解码 base64 内容
      const content = decodeBase64(base64Content.trim())

      return { success: true, data: { content, size: fileStat.size } }
    }
    catch (err) {
      console.error('readFile error:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * 写入文件内容
   * @param {string} filePath - 文件路径
   * @param {string} content - 文件内容
   * @param {Object} [options] - 选项
   * @param {boolean} [options.autoRefresh] - 是否自动刷新
   * @param {boolean} [options.createBackup] - 是否创建备份
   * @returns {Promise<import('../types.js').OperationResult>}
   */
  async function writeFile(filePath, content, { autoRefresh = true, createBackup = false } = {}) {
    if (!deviceId.value) {
      return { success: false, error: 'Device ID is required' }
    }

    try {
      // 可选：创建备份
      if (createBackup) {
        const backupPath = `${filePath}.bak`
        await $adb.deviceShell(deviceId.value, `cp "${filePath}" "${backupPath}" 2>/dev/null || true`)
      }

      // 使用 base64 编码写入文件，避免特殊字符问题
      const base64Content = encodeBase64(content)

      // 使用 echo 和 base64 解码写入文件
      await $adb.deviceShell(
        deviceId.value,
        `echo '${base64Content}' | base64 -d > "${filePath}"`,
      )

      if (autoRefresh) {
        await refresh()
      }

      return { success: true, data: { path: filePath } }
    }
    catch (err) {
      console.error('writeFile error:', err)
      return { success: false, error: err.message }
    }
  }

  return {
    // 状态
    loading: readonly(loading),
    files: readonly(files),
    error: readonly(error),
    lastRefreshTime: readonly(lastRefreshTime),

    // 基础操作
    readDirectory,
    refresh,
    createDirectory,
    createFile,
    remove,
    rename,
    copy,
    move,

    // 文件读写操作
    readFile,
    writeFile,

    // 查询操作
    exists,
    stat,
  }
}

export default useFileOperations
