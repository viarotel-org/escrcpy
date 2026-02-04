/**
 * @fileoverview File operations module
 * Encapsulates directory reading, create, delete, rename and other basic file operations
 */

import '../types.js'
import { decodeBase64, encodeBase64 } from '../helpers/index.js'

/** @type {typeof window.$preload.adb} */
const $adb = window.$preload.adb

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

  /** @type {import('vue').Ref<string|null>} Error message */
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
   * Refresh current directory
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
   * Rename file or folder
   * @param {import('../types.js').FileEntry} item - Item to rename
   * @param {string} newName - New name
   * @param {Object} [options] - Options
   * @param {boolean} [options.autoRefresh] - Auto refresh
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
   * Move files or folders
   * @param {import('../types.js').FileEntry|import('../types.js').FileEntry[]} items - Items to move
   * @param {string} targetPath - Target path
   * @param {Object} [options] - Options
   * @param {boolean} [options.autoRefresh] - Auto refresh
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
   * Check whether a path exists
   * @param {string} path - Path
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
   * Get file/folder information
   * @param {string} path - Path
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
   * Read file content
   * @param {string} filePath - File path
   * @param {Object} [options] - Options
   * @param {number} [options.maxSize] - Maximum file size (bytes), default 1MB
   * @returns {Promise<import('../types.js').OperationResult>}
   */
  async function readFile(filePath, { maxSize = 1024 * 1024 } = {}) {
    if (!deviceId.value) {
      return { success: false, error: 'Device ID is required' }
    }

    try {
      // First check file size
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

      // Use base64 to read file content to avoid special character issues
      const base64Content = await $adb.deviceShell(
        deviceId.value,
        `base64 "${filePath}"`,
      )

      // Decode base64 content
      const content = decodeBase64(base64Content.trim())

      return { success: true, data: { content, size: fileStat.size } }
    }
    catch (err) {
      console.error('readFile error:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Write file content
   * @param {string} filePath - File path
   * @param {string} content - File content
   * @param {Object} [options] - Options
   * @param {boolean} [options.autoRefresh] - Auto refresh
   * @param {boolean} [options.createBackup] - Create backup
   * @returns {Promise<import('../types.js').OperationResult>}
   */
  async function writeFile(filePath, content, { autoRefresh = true, createBackup = false } = {}) {
    if (!deviceId.value) {
      return { success: false, error: 'Device ID is required' }
    }

    try {
      // Optional: create backup
      if (createBackup) {
        const backupPath = `${filePath}.bak`
        await $adb.deviceShell(deviceId.value, `cp "${filePath}" "${backupPath}" 2>/dev/null || true`)
      }

      // Use base64 to write file content to avoid special character issues
      const base64Content = encodeBase64(content)

      // Use echo and base64 decode to write file
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
    // State
    loading: readonly(loading),
    files: readonly(files),
    error: readonly(error),
    lastRefreshTime: readonly(lastRefreshTime),

    // Basic operations
    readDirectory,
    refresh,
    createDirectory,
    createFile,
    remove,
    rename,
    copy,
    move,

    // File read/write operations
    readFile,
    writeFile,

    // Query operations
    exists,
    stat,
  }
}

export default useFileOperations
