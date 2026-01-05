/**
 * Copilot Agent Helper
 * 提供临时代理创建和会话代理获取功能
 *
 * @module CopilotAgentHelper
 */
import { AutoGLM } from 'autoglm.js'
import copilotService from '$copilot/electron/services/index.js'
import appStore from '$electron/helpers/store.js'

// ==================== 常量定义 ====================

/** 临时设备 ID 前缀 */
const TEMP_DEVICE_ID_PREFIX = 'temp-device'

// ==================== 类型定义 ====================

/**
 * 代理配置类型
 * @typedef {Object} AgentConfig
 * @property {string} [deviceId] - 设备 ID
 * @property {string} [baseUrl] - API 基础 URL
 * @property {string} [apiKey] - API 密钥
 * @property {string} [model] - 模型名称
 */

// ==================== 辅助函数 ====================

/**
 * 获取默认配置
 * @returns {Object} 默认配置对象
 * @private
 */
function getDefaultConfig() {
  return appStore.get('copilot') || {}
}

/**
 * 生成临时设备 ID
 * @param {string} [customId] - 自定义 ID
 * @returns {string} 设备 ID
 * @private
 */
function generateDeviceId(customId) {
  return customId || `${TEMP_DEVICE_ID_PREFIX}-${Date.now()}`
}

// ==================== 公开 API ====================

/**
 * 创建临时代理实例
 * 用于一次性任务或不需要会话管理的场景
 *
 * @param {AgentConfig} customConfig - 自定义配置
 * @returns {Promise<AutoGLM>} AutoGLM 实例
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
 * 创建或获取代理实例
 * 优先从会话中获取已有代理，不存在则创建临时代理
 *
 * @param {AgentConfig} customConfig - 自定义配置
 * @returns {Promise<AutoGLM>} AutoGLM 实例
 *
 * @example
 * const agent = await createOrGetAgent({ deviceId: 'device-123' })
 */
export async function createOrGetAgent(customConfig = {}) {
  const { deviceId } = customConfig

  // 如果提供了设备 ID，尝试从会话中获取
  if (deviceId) {
    const sessionInfo = copilotService.getSessionByDevice(deviceId)

    if (sessionInfo?.agent) {
      return sessionInfo.agent
    }
  }

  // 未找到会话或未提供设备 ID，创建临时代理
  return createTempAgent(customConfig)
}
