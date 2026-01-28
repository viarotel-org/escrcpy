import path from 'node:path'
import dayjs from 'dayjs'
import prettyBytes from 'pretty-bytes'
import pLimit from 'p-limit'
import { Adb } from '@devicefarmer/adbkit'
import electronStore from '$electron/helpers/store/index.js'

/**
 * High-performance directory listing with file stats; supports large files
 * @param {object} device - Adbkit device object
 * @param {string} dirPath - Directory path
 * @param {object} options - Optional parameters
 *   - concurrency: concurrency limit (default 5)
 *   - filter: file filter function (item => boolean)
 *   - map: file mapping function (item => item)
 * @returns {Promise<Array>} List of file info objects
 */
export async function readDirWithStat(device, dirPath, options = {}) {
  const {
    filter = () => true,
    map = null,
  } = options

  const concurrencyLimit = Number(options.concurrency ?? electronStore.get('common.concurrencyLimit') ?? 5)

  const limit = pLimit(concurrencyLimit)
  const entries = await device.readdir(dirPath)

  const results = await Promise.all(
    entries
      .filter(filter)
      .map(item =>
        limit(async () => {
          const fullPath = path.posix.join(dirPath, item.name)
          let size = 0n
          const mtime = item.mtimeMs

          try {
            if (item.isFile()) {
              // Use a more reliable command to obtain file size
              const output = await device.shell(`stat -c %s "${fullPath}"`)
              const buffer = await Adb.util.readAll(output)
              const sizeStr = buffer.toString().trim()
              size = BigInt(sizeStr)
            }
          }
          catch (err) {
            console.warn(`Failed to get info for ${fullPath}:`, err.message)
          }

          let fileInfo = {
            ...item,
            id: fullPath,
            name: item.name,
            type: item.isFile() ? 'file' : 'directory',
            size: size ? prettyBytes(Number(size), { binary: true, locale: true }) : undefined,
            rawSize: size,
            updateTime: mtime ? dayjs(mtime).format('YYYY-MM-DD HH:mm:ss') : '-',
          }

          if (typeof map === 'function') {
            fileInfo = map(fileInfo)
          }

          return fileInfo
        }),
      ),
  )

  return results
}
