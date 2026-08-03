import { delimiter, dirname, join } from 'node:path'
import { extraResolve } from './resources.js'
import { getAdbPath, getGnirehtetPath, getScrcpyPath, gnirehtetApkPath } from '$electron/configs/index.js'
import electronStore from '$electron/helpers/store/index.js'

export const rawEnvPath = process.env.RAW_PATH || ''

export const PLATFORM_MAP = Object.freeze({
  win32: 'win',
  darwin: 'mac',
  linux: 'linux',
})

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

  const binaryConfigs = {
    adb: {
      path: getAdbPath({ onlyStore: true }),
      defaultDir: extraDirs.adb,
    },
    scrcpy: {
      path: getScrcpyPath({ onlyStore: true }),
      defaultDir: extraDirs.scrcpy,
    },
    gnirehtet: {
      path: getGnirehtetPath({ onlyStore: true }),
      defaultDir: extraDirs.gnirehtet,
    },
  }

  const auto = Object.values(binaryConfigs).reduce((arr, { path, defaultDir }) => {
    const dir = dirnameOrUndefined(path)

    if (dir && dir !== defaultDir && !arr.includes(dir)) {
      arr.push(dir)
    }

    return arr
  }, [])

  process.env.PATH = resolveEnvPath({
    auto,
    win: extraDirs.win,
    mac: extraDirs.mac,
    linux: extraDirs.linux,
  })

  setupToolEnv({
    scrcpyDir: dirnameOrUndefined(binaryConfigs.scrcpy.path),
    defaultScrcpyDir: extraDirs.scrcpy,
  })
}

export function setupToolEnv({ scrcpyDir, defaultScrcpyDir }) {
  // Set environment variables for tools to ensure they can find their dependencies
  process.env.ADB = getAdbPath()
  process.env.GNIREHTET_APK = gnirehtetApkPath

  // For scrcpy, we need to set the icon directory and server path via environment variables
  const shouldUseBundledScrcpyAssets = !scrcpyDir || scrcpyDir === defaultScrcpyDir
  const currentScrcpyDir = shouldUseBundledScrcpyAssets ? extraResolve('common/scrcpy') : scrcpyDir
  process.env.SCRCPY_ICON_DIR = currentScrcpyDir
  process.env.SCRCPY_SERVER_PATH = join(currentScrcpyDir, 'scrcpy-server')

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

export function dirnameOrUndefined(filePath) {
  return filePath ? dirname(filePath) : void 0
}
