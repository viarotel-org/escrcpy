import { delimiter, dirname } from 'node:path'
import { extraResolve } from './resources.js'
import { getAdbPath, getGnirehtetPath, getScrcpyPath, gnirehtetApkPath } from '$electron/configs/index.js'

// Raw PATH environment variable
export const rawEnvPath = process.env.PATH || ''

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

  const currentPlatform = PLATFORM_MAP[process.platform]

  if (!currentPlatform && !options.auto?.length) {
    return rawEnvPath
  }

  const platformPaths = ['auto', currentPlatform].reduce((arr, key) => {
    const paths = (options[key] || []).filter(item => item && !rawEnvPath.includes(item))

    arr.push(...paths)

    return arr
  }, [])

  if (platformPaths.length === 0) {
    return rawEnvPath
  }

  // console.log('resolveEnvPath.platformPaths', platformPaths)

  return `${platformPaths.join(delimiter)}${delimiter}${rawEnvPath}`
}

/**
 * Setup the PATH environment variable by injecting necessary tool paths
 */
export function setupEnvPath() {
  const scrcpyPath = getScrcpyPath({ onlyStore: true })
  const adbPath = getAdbPath({ onlyStore: true })
  const gnirehtetPath = getGnirehtetPath({ onlyStore: true })

  const scrcpyDir = scrcpyPath ? dirname(scrcpyPath) : void 0
  const adbDir = adbPath ? dirname(adbPath) : void 0
  const gnirehtetDir = gnirehtetPath ? dirname(gnirehtetPath) : void 0

  process.env.PATH = resolveEnvPath({
    auto: [
      adbDir,
      scrcpyDir,
      gnirehtetDir,
    ],
    win: [
      extraResolve(`win-${process.arch}`),
      extraResolve('win'),
      extraResolve('win/scrcpy'),
      extraResolve('win/gnirehtet'),
    ],
    mac: [
      extraResolve(`mac-${process.arch}`),
      extraResolve(`mac-${process.arch}/scrcpy`),
    ],
    linux: [
      extraResolve(`linux-${process.arch}`),
      extraResolve(`linux-${process.arch}/scrcpy`),
      extraResolve(`linux-${process.arch}/gnirehtet`),
    ],
  })

  // Ensure ADB path is set in environment for subprocesses
  process.env.ADB = getAdbPath()

  // Ensure GNIREHTET_APK path is set in environment for subprocesses
  process.env.GNIREHTET_APK = gnirehtetApkPath
}
