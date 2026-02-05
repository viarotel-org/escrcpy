import os from 'node:os'
import path from 'node:path'
import { ipcxRenderer } from '@escrcpy/electron-ipcx/renderer'
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

/**
 * Create terminal session
 * @param {Object} config
 * @param {string} config.type - Terminal type ('device' | 'local')
 * @param {string} config.instanceId - Instance ID
 * @param {Object} config.options - Provider-specific options
 * @param {Function} config.onData - Data output callback
 * @param {Function} config.onExit - Exit callback
 * @param {Function} config.onError - Error callback
 * @returns {Promise<{success: boolean, sessionId?: string, error?: string, dispose?: Function}>}
 */
function createSession(config) {
  // 使用 invokeRetained 模式保持回调监听器活跃
  const { promise, dispose } = ipcxRenderer.invokeRetained('terminal:create-session', config)

  // 将 dispose 函数附加到结果中，由调用方在会话结束时清理
  return promise.then(result => ({ ...result, dispose }))
}

/**
 * Write data to session
 * @param {string} sessionId - Session ID
 * @param {string} data - Data to write
 * @returns {Promise<{success: boolean, error?: string}>}
 */
function writeSession(sessionId, data) {
  return ipcxRenderer.invoke('terminal:write-session', { sessionId, data })
}

/**
 * Resize session terminal
 * @param {string} sessionId - Session ID
 * @param {number} cols - Columns
 * @param {number} rows - Rows
 * @returns {Promise<{success: boolean, error?: string}>}
 */
function resizeSession(sessionId, cols, rows) {
  return ipcxRenderer.invoke('terminal:resize-session', { sessionId, cols, rows })
}

/**
 * Destroy session
 * @param {string} sessionId - Session ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
function destroySession(sessionId) {
  return ipcxRenderer.invoke('terminal:destroy-session', { sessionId })
}

// ===== Legacy API (Deprecated, for backward compatibility) =====

/**
 * @deprecated Use createSession({ type: 'device', instanceId: deviceId, options: { deviceId } }) instead
 */
async function createShell(deviceId) {
  const { ipcRenderer } = await import('electron')
  return ipcRenderer.invoke('terminal:create-shell', deviceId)
}

/**
 * @deprecated Use writeSession(sessionId, data) instead
 */
async function writeShell(shellId, data) {
  const { ipcRenderer } = await import('electron')
  return ipcRenderer.invoke('terminal:write-shell', shellId, data)
}

/**
 * @deprecated Use destroySession(sessionId) instead
 */
async function destroyShell(shellId) {
  const { ipcRenderer } = await import('electron')
  return ipcRenderer.invoke('terminal:destroy-shell', shellId)
}

/**
 * @deprecated No longer needed with new session management
 */
async function destroyDeviceShells(deviceId) {
  const { ipcRenderer } = await import('electron')
  return ipcRenderer.invoke('terminal:destroy-device-shells', deviceId)
}

export default {
  openSystemTerminal,
  getAvailableTerminals,
  openWithAdbCommand,
  openWithScrcpyCommand,
  openWithGnirehtetCommand,
  buildEnvironment,
  // New API
  createSession,
  writeSession,
  resizeSession,
  destroySession,
  // Legacy API (deprecated)
  createShell,
  writeShell,
  destroyShell,
  destroyDeviceShells,
}
