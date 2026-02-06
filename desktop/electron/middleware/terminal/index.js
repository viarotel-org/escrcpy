import { ipcxRenderer } from '@escrcpy/electron-ipcx/renderer'

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
  const { promise, dispose } = ipcxRenderer.invokeRetained('terminal:create-session', config)

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

export default {
  createSession,
  writeSession,
  resizeSession,
  destroySession,
}
