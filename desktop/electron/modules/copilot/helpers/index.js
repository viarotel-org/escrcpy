import { AutoGLM } from 'autoglm.js'
import { copilotService } from './service.js'
import electronStore from '$electron/helpers/store/index.js'

export * from './session.js'
export { copilotService }

const TEMP_DEVICE_ID_PREFIX = 'temp-device'
const SERVICE_PREFIX = 'copilot'
const LOG_PREFIX = '[CopilotHandlers]'

/**
 * Agent configuration
 * @typedef {Object} AgentConfig
 * @property {string} [deviceId] - Device ID
 * @property {string} [baseUrl] - API base URL
 * @property {string} [apiKey] - API key
 * @property {string} [model] - Model name
 */

/**
 * Get default configuration
 * @returns {Object} Default configuration object
 * @private
 */
function getDefaultConfig() {
  return electronStore.get('copilot') || {}
}

/**
 * Generate a temporary device ID
 * @param {string} [customId] - Custom ID
 * @returns {string} Device ID
 * @private
 */
function generateDeviceId(customId) {
  return customId || `${TEMP_DEVICE_ID_PREFIX}-${Date.now()}`
}

/**
 * Create a temporary agent instance
 * Used for one-off tasks or scenarios where session management is not required
 *
 * @param {AgentConfig} customConfig - Custom configuration
 * @returns {Promise<AutoGLM>} AutoGLM instance
 *
 * @example
 * const agent = await createTempAgent({ deviceId: 'my-device' })
 */
export async function createTempAgent(customConfig = {}) {
  const defaultConfig = getDefaultConfig()

  const agentConfig = {
    baseUrl: defaultConfig.baseUrl,
    apiKey: defaultConfig.apiKey,
    model: defaultConfig.model,
    ...customConfig,
    deviceId: generateDeviceId(customConfig.deviceId),
  }

  const agent = new AutoGLM(agentConfig)

  return agent
}

/**
 * Create or retrieve an agent instance
 * Attempts to retrieve an existing agent from the session first;
 * if none exists, a temporary agent is created
 *
 * @param {AgentConfig} customConfig - Custom configuration
 * @returns {Promise<AutoGLM>} AutoGLM instance
 *
 * @example
 * const agent = await createOrGetAgent({ deviceId: 'device-123' })
 */
export async function createOrGetAgent(customConfig = {}) {
  const { deviceId } = customConfig

  // If a device ID is provided, try to retrieve it from an existing session
  if (deviceId) {
    const sessionInfo = copilotService.getSessionByDevice(deviceId)

    if (sessionInfo?.agent) {
      return sessionInfo.agent
    }
  }

  // No session found or no device ID provided; create a temporary agent
  return createTempAgent(customConfig)
}

export function createChannel(method) {
  return `${SERVICE_PREFIX}:${method}`
}

export function handleError(operation, error) {
  console.error(`${LOG_PREFIX} ${operation} failed:`, error)
  throw error
}

export async function safeExecute(operation, fn) {
  try {
    return await fn()
  }
  catch (error) {
    handleError(operation, error)
  }
}
