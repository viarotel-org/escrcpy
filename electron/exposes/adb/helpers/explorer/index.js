import path from 'node:path'
import dayjs from 'dayjs'
import prettyBytes from 'pretty-bytes'
import pLimit from 'p-limit'
import { Adb } from '@devicefarmer/adbkit'

/**
 * 高性能获取目录文件信息，支持大文件
 * @param {object} device adbkit 设备对象
 * @param {string} dirPath 目录路径
 * @param {object} options 可选参数
 *   - concurrency: 并发限制 (默认 5)
 *   - filter: 文件过滤函数 (item => boolean)
 *   - map: 文件映射函数 (item => item)
 * @returns {Promise<Array>} 文件信息列表
 */
export async function readDirWithStat(device, dirPath, options = {}) {
  const {
    concurrency = 5,
    filter = () => true,
    map = null,
  } = options

  const limit = pLimit(concurrency)
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
              // 使用更可靠的命令获取文件大小
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
