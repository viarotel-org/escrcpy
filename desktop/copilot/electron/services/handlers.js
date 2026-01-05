/**
 * Copilot IPC Handlers
 * 处理渲染进程与主进程的 Copilot 相关 IPC 通信
 *
 * @module CopilotHandlers
 */

import { ipcxMain } from '@escrcpy/electron-ipcx/main'

import copilotService from './index.js'
import { createOrGetAgent } from './modules/index.js'
import { adbKeyboardApkPath } from '$electron/configs/index.js'

// ==================== 常量定义 ====================

/** 服务名称前缀 */
const SERVICE_PREFIX = 'copilot'

/** 日志前缀 */
const LOG_PREFIX = '[CopilotHandlers]'

// ==================== 工具函数 ====================

/**
 * 创建 IPC 通道名称
 * @param {string} method - 方法名
 * @returns {string} - 完整的 IPC 通道名称
 */
const createChannel = method => `${SERVICE_PREFIX}:${method}`

/**
 * 统一错误处理
 * @param {string} operation - 操作名称
 * @param {Error} error - 错误对象
 * @throws {Error} 重新抛出错误
 */
function handleError(operation, error) {
  console.error(`${LOG_PREFIX} ${operation} 失败:`, error)
  throw error
}

/**
 * 安全执行异步操作
 * @param {string} operation - 操作名称
 * @param {Function} fn - 异步函数
 * @returns {Promise<*>} 执行结果
 */
async function safeExecute(operation, fn) {
  try {
    return await fn()
  }
  catch (error) {
    handleError(operation, error)
  }
}

// ==================== Handler 注册 ====================

/**
 * 注册所有 Copilot 相关的 IPC 处理器
 * @param {Electron.BrowserWindow} [mainWindow] - 主窗口实例（可选，用于特殊场景）
 */
export function registerCopilotHandlers(mainWindow) {
  // ==================== 核心任务执行 ====================

  /**
   * 执行任务（支持单设备和批量设备）
   */
  ipcxMain.handle(createChannel('execute'), async (_event, task, options = {}) => {
    const { onSession, onData, onExit, ...restOptions } = options

    return safeExecute('execute', () =>
      copilotService.execute(task, {
        ...restOptions,
        onSession,
        onData,
        onExit,
      }),
    )
  })

  /**
   * 停止设备的当前任务
   */
  ipcxMain.handle(createChannel('stop'), async (_, deviceId, reason) =>
    safeExecute('stop', () =>
      copilotService.stop(deviceId, reason),
    ),
  )

  /**
   * 销毁设备的会话
   */
  ipcxMain.handle(createChannel('destroy'), async (_, deviceId) =>
    safeExecute('destroy', () =>
      copilotService.destroy(deviceId),
    ),
  )

  /**
   * 销毁所有会话
   */
  ipcxMain.handle(createChannel('destroyAll'), async () =>
    safeExecute('destroyAll', () =>
      copilotService.destroyAll(),
    ),
  )

  // ==================== 会话查询 ====================

  /**
   * 获取设备的会话信息
   */
  ipcxMain.handle(createChannel('getSessionByDevice'), async (_, deviceId) =>
    copilotService.getSessionByDevice(deviceId),
  )

  /**
   * 获取所有活跃会话
   */
  ipcxMain.handle(createChannel('getActiveSessions'), async () =>
    copilotService.getActiveSessions(),
  )

  // ==================== 前置检查相关 ====================

  /**
   * 检查 ADB 键盘是否已安装
   */
  ipcxMain.handle(createChannel('checkKeyboard'), async (_, deviceId) =>
    safeExecute('checkKeyboard', async () => {
      const agent = await createOrGetAgent({ deviceId })
      const result = await agent.adb.isKeyboardInstalled()

      // 如果未安装，自动安装
      if (!result?.success) {
        await agent.adb.installKeyboard(adbKeyboardApkPath)
      }

      return result?.success || false
    }),
  )

  /**
   * 安装 ADB 键盘
   */
  ipcxMain.handle(createChannel('installKeyboard'), async (_, deviceId) =>
    safeExecute('installKeyboard', async () => {
      const agent = await createOrGetAgent({ deviceId })
      await agent.adb.installKeyboard(adbKeyboardApkPath)
      return await agent.adb.isKeyboardInstalled()
    }),
  )

  /**
   * 检查模型 API 服务
   */
  ipcxMain.handle(createChannel('checkModelApi'), async (_, config) =>
    safeExecute('checkModelApi', async () => {
      const agent = await createOrGetAgent({
        baseUrl: config.baseUrl,
        apiKey: config.apiKey,
        model: config.model,
      })
      return await agent.checkModelApi()
    }),
  )

  // ==================== 高级配置 ====================

  /**
   * 设置空闲超时时间
   */
  ipcxMain.handle(createChannel('setIdleTimeout'), async (_, timeout) => {
    copilotService.setIdleTimeout(timeout)
    return true
  })

  console.log(`${LOG_PREFIX} IPC 处理器已注册 (前缀: ${SERVICE_PREFIX})`)
}

// ==================== Handler 注销 ====================

/**
 * 注销所有 Copilot IPC 处理器
 * 用于热重载等场景
 */
export function unregisterCopilotHandlers() {
  const methods = [
    'execute',
    'stop',
    'destroy',
    'destroyAll',
    'getSessionByDevice',
    'getActiveSessions',
    'checkKeyboard',
    'installKeyboard',
    'checkModelApi',
    'setIdleTimeout',
  ]

  methods.forEach((method) => {
    ipcxMain.removeHandler(createChannel(method))
  })

  console.log(`${LOG_PREFIX} IPC 处理器已注销`)
}
