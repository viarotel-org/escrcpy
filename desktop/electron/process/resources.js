import { delimiter, resolve } from 'node:path'
import which from 'which'

export const PLATFORM_MAP = Object.freeze({
  win32: 'win',
  darwin: 'mac',
  linux: 'linux',
})

export function extraResolve(filePath) {
  const isProduction = import.meta.env.MODE === 'production'

  const basePath = isProduction ? process.resourcesPath : 'electron/resources'

  const value = resolve(basePath, 'extra', filePath)

  return value
}

export function buildResolve(value) {
  return resolve(`electron/resources/build/${value}`)
}

export function whichResolve(command, dir) {
  const extraDirs = Object.values(getExtraPlatformDirs())
  const filteredDirs = [...new Set([dir, ...extraDirs])]
  const searchPath = [...filteredDirs, process.env.PATH].filter(Boolean).join(delimiter)

  return which.sync(command, { nothrow: true, path: searchPath })
}

/**
 * Compute platform-specific extra directories for adb, scrcpy, and gnirehtet.
 * Shared by which module (dependency resolution) and helper (PATH setup).
 */
export function getExtraPlatformDirs() {
  const platform = PLATFORM_MAP[process.platform]
  const arch = process.arch
  const platformArch = platform === 'win' ? 'win' : `${platform}-${arch}`

  return {
    adb: extraResolve(`${platformArch}/scrcpy`),
    scrcpy: extraResolve(`${platformArch}/scrcpy`),
    gnirehtet: extraResolve(`${platformArch}/gnirehtet`),
  }
}
