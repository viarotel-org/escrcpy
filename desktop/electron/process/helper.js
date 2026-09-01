import { existsSync } from 'node:fs'
import { delimiter, join } from 'node:path'
import { extraResolve, PLATFORM_MAP } from './resources.js'
import { getAdb, getUserAdbDir, getUserGnirehtetDir, getUserScrcpyDir, gnirehtetApkPath } from '$electron/configs/index.js'
import electronStore from '$electron/helpers/store/index.js'

export const rawEnvPath = process.env.RAW_PATH || ''

export function setupEnvPath() {
  const platform = PLATFORM_MAP[process.platform]
  const arch = process.arch
  const platformArch = `${platform}-${arch}`

  const extraScrcpyDirs = {
    win: extraResolve('win/scrcpy'),
    mac: extraResolve(`${platformArch}/scrcpy`),
    linux: extraResolve(`${platformArch}/scrcpy`),
  }

  const extraGnirehtetDirs = {
    win: extraResolve('win/gnirehtet'),
    mac: extraResolve(`${platformArch}/gnirehtet`),
    linux: extraResolve(`${platformArch}/gnirehtet`),
  }

  const extraDirs = {
    adb: extraScrcpyDirs[platform],
    scrcpy: extraScrcpyDirs[platform],
    gnirehtet: extraGnirehtetDirs[platform],

    win: [
      extraResolve('win'),
      extraScrcpyDirs.win,
      extraGnirehtetDirs.win,
    ],
    mac: [
      extraResolve(platformArch),
      extraScrcpyDirs.mac,
      extraGnirehtetDirs.mac,
    ],
    linux: [
      extraResolve(platformArch),
      extraScrcpyDirs.linux,
      extraGnirehtetDirs.linux,
    ],
  }

  // Collect user-configured directories (already directories, no dirname needed)
  const userDirs = [
    getUserAdbDir(),
    getUserScrcpyDir(),
    getUserGnirehtetDir(),
  ].filter((dir) => {
    return dir && !Object.values(extraDirs).flat().includes(dir)
  })

  const auto = [...new Set(userDirs)]

  process.env.PATH = resolveEnvPath({
    auto,
    win: extraDirs.win,
    mac: extraDirs.mac,
    linux: extraDirs.linux,
  })

  setupToolEnv()
}

export function setupToolEnv() {
  // Set environment variables for tools to ensure they can find their dependencies
  process.env.ADB = getAdb()
  process.env.GNIREHTET_APK = gnirehtetApkPath

  const commonScrcpyDir = extraResolve('common/scrcpy')

  process.env.SCRCPY_ICON_DIR = commonScrcpyDir
  process.env.SCRCPY_SERVER_PATH = getScrcpyResourcesPath({ resourceName: 'scrcpy-server', rollbackDir: commonScrcpyDir })

  // Load additional environment variables from the store
  const variables = (electronStore.get('common.environmentVariables') || '').split(/\r?\n/).filter(Boolean)
  variables.forEach((item) => {
    const [key, value] = item.split('=')
    if (key && value) {
      process.env[key] = value
    }
  })
}

export function resolveEnvPath(options = {}) {
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

  return `${platformPaths.join(delimiter)}${delimiter}${rawEnvPath}`
}

export function getScrcpyResourcesPath(options = {}) {
  const { rollbackDir, resourceName = 'scrcpy-server' } = options

  const scrcpyDir = getUserScrcpyDir()
  const resourcePath = dir => join(dir, resourceName)

  if (!scrcpyDir) {
    return resourcePath(rollbackDir)
  }

  if (!existsSync(resourcePath(scrcpyDir))) {
    return resourcePath(rollbackDir)
  }

  return resourcePath(scrcpyDir)
}
