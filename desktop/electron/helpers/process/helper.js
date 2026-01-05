import { delimiter } from 'node:path'

/**
 * 通过注入特定于平台和或自动检测的路径来解析新的 PATH 环境变量字符串。
 * @param {Object} [options] - 各平台的自定义路径配置
 * @param {string[]} [options.win] - Windows平台需注入的路径列表
 * @param {string[]} [options.mac] - MacOS平台需注入的路径列表
 * @param {string[]} [options.linux] - Linux平台需注入的路径列表
 * @param {string[]} [options.auto] - 自动根据当前平台注入对应路径列表
 * @returns {string} 注入后的完整PATH字符串
 */
export function resolveEnvPath(options = {}) {
  const PLATFORM_MAP = Object.freeze({
    win32: 'win',
    darwin: 'mac',
    linux: 'linux',
  })

  const defaultPath = process.env.PATH || ''

  const currentPlatform = PLATFORM_MAP[process.platform]

  if (!currentPlatform && !options.auto?.length) {
    return defaultPath
  }

  const platformPaths = ['auto', currentPlatform].reduce((arr, key) => {
    const paths = (options[key] || []).filter(item => item && !defaultPath.includes(item))

    arr.push(...paths)

    return arr
  }, [])

  if (platformPaths.length === 0) {
    return defaultPath
  }

  return `${platformPaths.join(delimiter)}${delimiter}${defaultPath}`
}
