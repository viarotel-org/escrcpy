/**
 * Copilot Service - 主进程服务
 * 集中管理所有 Copilot 相关逻辑
 *
 * 通过统一的 PTY Service 管理 Copilot 进程，提供：
 * - 标准化的会话管理
 * - 配置管理（API key、model 等）
 * - 命令参数构建
 * - 事件订阅（数据、退出）
 */
import os from 'node:os'
import appStore from '$electron/helpers/store.js'
import { copilotDefaultConfig, copilotPath } from '$electron/configs/index.js'
import ptyService from '$electron/services/pty/index.js'

class CopilotService {
  constructor() {
    // Copilot 服务不再直接管理 PTY 会话，而是委托给 PTYService
    // 仅维护 Copilot 特定的元数据映射
    this.copilotSessions = new Map() // Map<sessionId, CopilotMetadata>
  }

  /**
   * 获取 Copilot 可执行文件路径
   * @returns {string} Copilot 可执行文件路径
   */
  getCopilotPath() {
    const customPath = appStore.get('common.copilotPath')
    if (customPath && customPath !== copilotPath) {
      return customPath
    }
    return copilotPath
  }

  /**
   * 构建 Copilot CLI 参数
   * @param {string} task - 任务指令
   * @param {object} options - 可选参数
   * @param {string|string[]} options.deviceId - 设备 ID（支持多设备）
   * @param {number} options.maxSteps - 最大步数
   * @param {boolean} options.quiet - 静默模式
   * @returns {string[]} 参数数组
   */
  buildCopilotArgs(task, options = {}) {
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
      args.push(task)
    }

    return args
  }

  /**
   * 创建 Copilot 会话
   *
   * 通过 PTYService 创建底层 PTY 会话，并附加 Copilot 特定的元数据
   *
   * @param {string} task - 任务指令
   * @param {object} options - 执行选项
   * @param {string|string[]} options.deviceId - 设备 ID
   * @param {number} options.maxSteps - 最大步数
   * @param {boolean} options.quiet - 静默模式
   * @param {number} options.cols - 终端列数
   * @param {number} options.rows - 终端行数
   * @param {string} options.cwd - 工作目录
   * @returns {object} 会话信息 { id, pid, task }
   */
  createSession(task, options = {}) {
    const copilotExePath = this.getCopilotPath()

    if (!copilotExePath) {
      throw new Error(
        'Failed to retrieve Copilot dependency path. Please ensure that the dependency is installed correctly.',
      )
    }

    // 构建 Copilot CLI 参数
    const args = this.buildCopilotArgs(task, options)

    // 使用 PTYService 创建会话
    const session = ptyService.createSession({
      file: copilotExePath,
      args,
      cwd: options.cwd || os.homedir(),
      cols: options.cols || 80,
      rows: options.rows || 24,
      // 清理代理变量，避免 Copilot 内置 Python 环境因缺少 socksio 包导致请求失败
      cleanProxyVars: true,
      // 注入 ADB 路径
      injectToolPaths: true,
      // 附加元数据
      metadata: {
        type: 'copilot',
        task,
        deviceId: options.deviceId,
        maxSteps: options.maxSteps,
        quiet: options.quiet,
      },
    })

    // 存储 Copilot 特定元数据
    this.copilotSessions.set(session.id, {
      task,
      deviceId: options.deviceId,
      createdAt: Date.now(),
    })

    return {
      id: session.id,
      pid: session.pid,
      task,
    }
  }

  /**
   * 订阅数据事件
   * 委托给 PTYService
   *
   * @param {string} sessionId - 会话 ID
   * @param {Function} callback - 数据回调函数 (data: string) => void
   * @returns {Function} 取消订阅函数
   */
  onData(sessionId, callback) {
    if (!ptyService.hasSession(sessionId)) {
      throw new Error(`Copilot session not found: ${sessionId}`)
    }
    return ptyService.onData(sessionId, callback)
  }

  /**
   * 订阅退出事件
   * 委托给 PTYService，并在退出时清理 Copilot 元数据
   *
   * @param {string} sessionId - 会话 ID
   * @param {Function} callback - 退出回调函数 (exitCode: number, signal: number) => void
   * @returns {Function} 取消订阅函数
   */
  onExit(sessionId, callback) {
    if (!ptyService.hasSession(sessionId)) {
      throw new Error(`Copilot session not found: ${sessionId}`)
    }

    // 包装回调以清理元数据
    const wrappedCallback = (exitCode, signal) => {
      this.copilotSessions.delete(sessionId)
      callback(exitCode, signal)
    }

    return ptyService.onExit(sessionId, wrappedCallback)
  }

  /**
   * 销毁会话
   * 委托给 PTYService
   *
   * @param {string} sessionId - 会话 ID
   */
  destroy(sessionId) {
    ptyService.destroy(sessionId)
    this.copilotSessions.delete(sessionId)
  }

  /**
   * 获取会话信息
   * 合并 PTYService 的会话信息和 Copilot 特定元数据
   *
   * @param {string} sessionId - 会话 ID
   * @returns {object|null} 会话信息或 null
   */
  getSession(sessionId) {
    const ptySession = ptyService.getSession(sessionId)
    if (!ptySession) {
      return null
    }

    const copilotMetadata = this.copilotSessions.get(sessionId) || {}

    return {
      id: ptySession.id,
      pid: ptySession.pid,
      task: copilotMetadata.task,
      deviceId: copilotMetadata.deviceId,
      createdAt: ptySession.createdAt,
    }
  }

  /**
   * 列出所有活动会话
   * @returns {Array} 会话列表
   */
  listSessions() {
    const allSessions = ptyService.listSessions()

    // 仅返回 Copilot 类型的会话
    return allSessions
      .filter(session => session.metadata?.type === 'copilot')
      .map((session) => {
        const copilotMetadata = this.copilotSessions.get(session.id) || {}
        return {
          id: session.id,
          pid: session.pid,
          task: copilotMetadata.task,
          deviceId: copilotMetadata.deviceId,
          createdAt: session.createdAt,
        }
      })
  }

  /**
   * 销毁所有 Copilot 会话
   */
  destroyAll() {
    const copilotSessionIds = Array.from(this.copilotSessions.keys())
    copilotSessionIds.forEach(sessionId => this.destroy(sessionId))
  }

  /**
   * 写入数据到会话（用于交互式场景）
   * 委托给 PTYService
   *
   * @param {string} sessionId - 会话 ID
   * @param {string} data - 要写入的数据
   */
  write(sessionId, data) {
    return ptyService.write(sessionId, data)
  }

  /**
   * 调整会话终端大小
   * 委托给 PTYService
   *
   * @param {string} sessionId - 会话 ID
   * @param {number} cols - 列数
   * @param {number} rows - 行数
   */
  resize(sessionId, cols, rows) {
    return ptyService.resize(sessionId, cols, rows)
  }

  /**
   * 获取 Copilot 配置
   * @returns {object}
   */
  getConfig() {
    return appStore.get('copilot') || copilotDefaultConfig
  }

  /**
   * 设置 Copilot 配置
   * @param {string|null} key - 配置键（为 null 时替换整个配置）
   * @param {any} value - 配置值
   */
  setConfig(key, value) {
    if (key) {
      appStore.set(`copilot.${key}`, value)
    }
    else {
      appStore.set('copilot', value)
    }
  }

  /**
   * 获取默认配置
   * @returns {object}
   */
  getDefaultConfig() {
    return copilotDefaultConfig
  }
}

// 导出单例
const copilotService = new CopilotService()

export default copilotService
