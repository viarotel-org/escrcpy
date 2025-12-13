import appStore from '$electron/helpers/store.js'
import { copilotDefaultConfig } from '$electron/configs/index.js'

/**
 * 构建 Copilot CLI 参数
 * @param {string} task - 任务指令
 * @param {object} options - 可选参数
 * @returns {string[]} 参数数组
 */
export function buildCopilotArgs(task, options = {}) {
  const config = appStore.get('copilot') || copilotDefaultConfig
  const args = []

  // 必选参数（缺失时抛出明确错误）
  if (!config.baseUrl) {
    throw new Error('copilot.baseUrl 未配置')
  }
  if (!config.apiKey) {
    throw new Error('copilot.apiKey 未配置')
  }

  args.push('--base-url', config.baseUrl)
  args.push('--apikey', config.apiKey)

  // 可选参数（从配置/options 读取）
  if (config.model) {
    args.push('--model', config.model)
  }

  if (options.deviceId) {
    // 批量设备时支持多设备ID传入，用逗号分隔
    const deviceIds = Array.isArray(options.deviceId)
      ? options.deviceId.join(',')
      : options.deviceId
    args.push('--device-id', deviceIds)
  }

  const maxSteps = options.maxSteps || config.maxSteps
  if (maxSteps) {
    args.push('--max-steps', String(maxSteps))
  }

  if (options.quiet || config.quiet) {
    args.push('--quiet')
  }

  if (config.lang) {
    args.push('--lang', config.lang)
  }

  // 任务指令
  if (task) {
    args.push(`"${task}"`)
  }

  return args
}

/**
 * 解析设备列表输出
 * 解析 "Connected devices:\n device1\n device2" 格式
 * @param {string} output - 命令输出
 * @returns {Array<{id: string, name: string}>}
 */
export function parseDeviceList(output) {
  const lines = output.split('\n').filter(line => line.trim())
  return lines.slice(1).map((line) => {
    const id = line.trim()
    return { id, name: id }
  })
}

/**
 * 解析应用列表输出
 * 解析 "Supported applications:\n app1\n app2" 格式
 * @param {string} output - 命令输出
 * @returns {string[]}
 */
export function parseAppList(output) {
  const lines = output.split('\n').filter(line => line.trim())
  return lines.slice(1).map(line => line.trim())
}

/**
 * 格式化错误信息
 * @param {string} type - 错误类型
 * @param {string} message - 错误消息
 * @returns {{code: string, message: string}}
 */
export function formatError(type, message) {
  const errorTypes = {
    CONFIG_MISSING: 'CONFIG_MISSING',
    ADB_CONNECTION_FAILED: 'ADB_CONNECTION_FAILED',
    PROCESS_ERROR: 'PROCESS_ERROR',
    TIMEOUT: 'TIMEOUT',
    UNKNOWN: 'UNKNOWN',
  }

  return {
    code: errorTypes[type] || errorTypes.UNKNOWN,
    message,
  }
}

/**
 * 获取 Copilot 配置
 * @returns {object}
 */
export function getCopilotConfig() {
  return appStore.get('copilot') || copilotDefaultConfig
}

/**
 * 设置 Copilot 配置
 * @param {string} key - 配置键
 * @param {any} value - 配置值
 */
export function setCopilotConfig(key, value) {
  if (key) {
    appStore.set(`copilot.${key}`, value)
  }
  else {
    appStore.set('copilot', value)
  }
}
