/**
 * Copilot IPC Handlers - 标准化的 IPC 处理器注册
 * 遵循 "服务名:方法名" 的命名规范
 */
import { ipcMain } from 'electron'
import copilotService from './index.js'

// 定义服务名称前缀
const SERVICE_PREFIX = 'copilot'

/**
 * 创建 IPC 通道名称
 * @param {string} method - 方法名
 * @returns {string} - 完整的 IPC 通道名称
 */
const createChannel = method => `${SERVICE_PREFIX}:${method}`

/**
 * 注册所有 Copilot 相关的 IPC 处理器
 * @param {Electron.BrowserWindow} mainWindow - 主窗口实例（用于事件订阅）
 */
export function registerCopilotHandlers(mainWindow) {
  ipcMain.handle(createChannel('createSession'), async (_, task, options) => {
    return copilotService.createSession(task, options)
  })

  ipcMain.handle(createChannel('write'), async (_, { sessionId, data }) => {
    return copilotService.write(sessionId, data)
  })

  ipcMain.handle(createChannel('resize'), async (_, { sessionId, cols, rows }) => {
    return copilotService.resize(sessionId, cols, rows)
  })

  ipcMain.handle(createChannel('destroy'), async (_, sessionId) => {
    return copilotService.destroy(sessionId)
  })

  ipcMain.handle(createChannel('getSession'), async (_, sessionId) => {
    return copilotService.getSession(sessionId)
  })

  ipcMain.handle(createChannel('listSessions'), async () => {
    return copilotService.listSessions()
  })

  ipcMain.handle(createChannel('destroyAll'), async () => {
    return copilotService.destroyAll()
  })

  // 配置管理
  ipcMain.handle(createChannel('getConfig'), async () => {
    return copilotService.getConfig()
  })

  ipcMain.handle(createChannel('setConfig'), async (_, key, value) => {
    return copilotService.setConfig(key, value)
  })

  ipcMain.handle(createChannel('getDefaultConfig'), async () => {
    return copilotService.getDefaultConfig()
  })

  // 事件订阅管理
  const subscriptions = new Map()

  ipcMain.handle(createChannel('onData'), async (event, sessionId) => {
    const webContentsId = event.sender.id
    const key = `${sessionId}-${webContentsId}-data`

    // 清理已有订阅
    if (subscriptions.has(key)) {
      subscriptions.get(key)()
      subscriptions.delete(key)
    }

    // 注册新订阅
    const unsubscribe = copilotService.onData(sessionId, (data) => {
      if (!event.sender.isDestroyed()) {
        event.sender.send(createChannel(`data:${sessionId}`), data)
      }
    })

    subscriptions.set(key, unsubscribe)
    return true
  })

  ipcMain.handle(createChannel('onExit'), async (event, sessionId) => {
    const webContentsId = event.sender.id
    const key = `${sessionId}-${webContentsId}-exit`

    // 清理已有订阅
    if (subscriptions.has(key)) {
      subscriptions.get(key)()
      subscriptions.delete(key)
    }

    // 注册新订阅
    const unsubscribe = copilotService.onExit(sessionId, (exitCode, signal) => {
      if (!event.sender.isDestroyed()) {
        event.sender.send(createChannel(`exit:${sessionId}`), { exitCode, signal })
      }

      // 清理相关订阅
      for (const [k, unsub] of subscriptions.entries()) {
        if (k.startsWith(`${sessionId}-`)) {
          unsub()
          subscriptions.delete(k)
        }
      }
    })

    subscriptions.set(key, unsubscribe)
    return true
  })

  ipcMain.handle(createChannel('offData'), async (event, sessionId) => {
    const webContentsId = event.sender.id
    const key = `${sessionId}-${webContentsId}-data`

    if (subscriptions.has(key)) {
      subscriptions.get(key)()
      subscriptions.delete(key)
    }

    return true
  })

  ipcMain.handle(createChannel('offExit'), async (event, sessionId) => {
    const webContentsId = event.sender.id
    const key = `${sessionId}-${webContentsId}-exit`

    if (subscriptions.has(key)) {
      subscriptions.get(key)()
      subscriptions.delete(key)
    }

    return true
  })

  console.log(`[Copilot Service] IPC handlers registered with prefix: ${SERVICE_PREFIX}`)
}

/**
 * 注销所有处理器（用于热重载等场景）
 */
export function unregisterCopilotHandlers() {
  const methods = [
    'createSession',
    'write',
    'resize',
    'destroy',
    'getSession',
    'listSessions',
    'destroyAll',
    'getConfig',
    'setConfig',
    'getDefaultConfig',
    'onData',
    'onExit',
    'offData',
    'offExit',
  ]

  methods.forEach((method) => {
    ipcMain.removeHandler(createChannel(method))
  })

  console.log(`[Copilot Service] IPC handlers unregistered`)
}
