import os from 'node:os'
import path from 'node:path'
import electronStore from '$electron/helpers/store/index.js'
import { getAdbPath, getGnirehtetPath, getScrcpyPath } from '$electron/configs/index.js'

/**
 * Get platform-specific terminal handler
 * @returns {Object} - Platform terminal module
 */
function getPlatformTerminal() {
  const platform = os.platform()

  switch (platform) {
    case 'darwin':
      return import('./platforms/macos.js')
    case 'linux':
      return import('./platforms/linux.js')
    case 'win32':
      return import('./platforms/windows.js')
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}

/**
 * Build environment variables with ADB, Scrcpy, and Gnirehtet paths
 * @param {Object} customEnv - Custom environment variables
 * @returns {Object} - Merged environment variables
 */
function buildEnvironment(customEnv = {}) {
  const currentAdbPath = getAdbPath()
  const currentScrcpyPath = getScrcpyPath()
  const currentGnirehtetPath = getGnirehtetPath()

  // Get directory paths (filter out undefined/null values)
  const pathDirs = new Set()

  if (currentAdbPath) {
    pathDirs.add(path.dirname(currentAdbPath))
  }
  if (currentScrcpyPath) {
    pathDirs.add(path.dirname(currentScrcpyPath))
  }
  if (currentGnirehtetPath) {
    pathDirs.add(path.dirname(currentGnirehtetPath))
  }

  // Build PATH with unique directories
  const existingPath = process.env.PATH || ''
  const pathSeparator = os.platform() === 'win32' ? ';' : ':'

  const newPath = pathDirs.size > 0
    ? [...pathDirs, existingPath].join(pathSeparator)
    : existingPath

  const env = {
    ...process.env,
    PATH: newPath,
    ...customEnv,
  }

  // Only add tool paths if they are defined
  if (currentAdbPath) {
    env.ADB = currentAdbPath
  }
  if (currentScrcpyPath) {
    env.SCRCPY = currentScrcpyPath
  }
  if (currentGnirehtetPath) {
    env.GNIREHTET = currentGnirehtetPath
  }

  return env
}

/**
 * Open system terminal with environment variables
 * @param {Object} options - Options
 * @param {Object} options.env - Custom environment variables to inject
 * @param {string} options.cwd - Working directory (default: user home)
 * @param {string} options.command - Command to execute in terminal
 * @param {string} options.preferredTerminal - Preferred terminal application
 * @returns {Promise<void>}
 */
async function openSystemTerminal(options = {}) {
  const {
    env: customEnv = {},
    cwd = os.homedir(),
    command = '',
    preferredTerminal,
  } = options

  // Check if system terminal is enabled
  const enableSystemTerminal = electronStore.get('common.enableSystemTerminal')
  if (!enableSystemTerminal) {
    throw new Error('System terminal is disabled. Enable it in preferences.')
  }

  // Get user's preferred terminal from settings
  const userPreferredTerminal = preferredTerminal || electronStore.get('common.preferredTerminal')

  // Build environment with ADB and other paths
  const env = buildEnvironment(customEnv)

  // Log for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('[Terminal] Opening system terminal with options:', {
      cwd,
      command,
      preferredTerminal: userPreferredTerminal,
      hasADB: !!env.ADB,
      hasSCRCPY: !!env.SCRCPY,
      hasGNIREHTET: !!env.GNIREHTET,
    })
  }

  // Get platform-specific terminal handler
  const platformTerminal = await getPlatformTerminal()

  // Open terminal
  await platformTerminal.openSystemTerminal({
    env,
    cwd,
    command,
    preferredTerminal: userPreferredTerminal,
  })
}

/**
 * Get available terminals for current platform
 * @returns {Promise<Array>} - List of available terminals
 */
async function getAvailableTerminals() {
  const platformTerminal = await getPlatformTerminal()
  return platformTerminal.getAvailableTerminals()
}

/**
 * Open terminal with ADB command
 * @param {string} command - ADB command (without 'adb' prefix)
 * @param {Object} options - Additional options
 * @returns {Promise<void>}
 */
async function openWithAdbCommand(command = '', options = {}) {
  const currentAdbPath = getAdbPath()

  if (!currentAdbPath) {
    throw new Error('ADB path is not configured. Please set it in preferences.')
  }

  const fullCommand = command ? `adb ${command}` : 'adb devices'

  await openSystemTerminal({
    ...options,
    command: fullCommand,
  })
}

/**
 * Open terminal with Scrcpy command
 * @param {string} command - Scrcpy command (without 'scrcpy' prefix)
 * @param {Object} options - Additional options
 * @returns {Promise<void>}
 */
async function openWithScrcpyCommand(command = '', options = {}) {
  const currentScrcpyPath = getScrcpyPath()

  if (!currentScrcpyPath) {
    throw new Error('Scrcpy path is not configured. Please set it in preferences.')
  }

  const fullCommand = command ? `scrcpy ${command}` : 'scrcpy --help'

  await openSystemTerminal({
    ...options,
    command: fullCommand,
  })
}

/**
 * Open terminal with Gnirehtet command
 * @param {string} command - Gnirehtet command (without 'gnirehtet' prefix)
 * @param {Object} options - Additional options
 * @returns {Promise<void>}
 */
async function openWithGnirehtetCommand(command = '', options = {}) {
  const currentGnirehtetPath = getGnirehtetPath()

  if (!currentGnirehtetPath) {
    throw new Error('Gnirehtet path is not configured')
  }

  const gnirehtetCmd = path.basename(currentGnirehtetPath)

  const fullCommand = command ? `${gnirehtetCmd} ${command}` : `${gnirehtetCmd} --help`

  await openSystemTerminal({
    ...options,
    command: fullCommand,
  })
}

export default {
  openSystemTerminal,
  getAvailableTerminals,
  openWithAdbCommand,
  openWithScrcpyCommand,
  openWithGnirehtetCommand,
  buildEnvironment,
}
