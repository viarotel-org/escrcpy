import { delimiter } from 'node:path'

/**
 * Resolve a new PATH environment string by injecting platform-specific or auto-detected paths.
 * @param {Object} [options] - Custom path configurations per platform
 * @param {string[]} [options.win] - Paths to inject on Windows
 * @param {string[]} [options.mac] - Paths to inject on macOS
 * @param {string[]} [options.linux] - Paths to inject on Linux
 * @param {string[]} [options.auto] - Paths to inject automatically based on the current platform
 * @returns {string} The resulting PATH string after injection
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
