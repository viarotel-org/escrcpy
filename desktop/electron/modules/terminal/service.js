import { ipcxMain } from '@escrcpy/electron-ipcx/main'
import { sessionManager } from './helpers/index.js'

/**
 * Terminal Service
 * 提供通用终端会话管理的 IPC 接口
 */
export default {
  name: 'module:terminal:service',
  apply(mainApp) {
    /**
     * 创建终端会话
     * @param {Object} payload
     * @param {string} payload.type - 终端类型 ('device' | 'local')
     * @param {string} payload.instanceId - 实例 ID
     * @param {Object} payload.options - Provider 特定选项
     * @param {Function} payload.onData - 数据输出回调（通过 electron-ipcx 支持）
     * @param {Function} payload.onExit - 退出回调
     * @param {Function} payload.onError - 错误回调
     */
    ipcxMain.handle('terminal:create-session', async (_event, payload) => {
      try {
        const { type, instanceId, options, onData, onExit, onError } = payload

        const { sessionId } = await sessionManager.create({
          type,
          instanceId,
          callbacks: {
            onData,
            onExit,
            onError,
          },
          options,
        })

        return { success: true, sessionId }
      }
      catch (error) {
        console.error('[Terminal Service] Failed to create session:', error)
        return { success: false, error: error.message }
      }
    })

    /**
     * 写入数据到会话
     */
    ipcxMain.handle('terminal:write-session', async (_event, payload) => {
      try {
        const { sessionId, data } = payload
        sessionManager.write(sessionId, data)
        return { success: true }
      }
      catch (error) {
        console.error('[Terminal Service] Failed to write session:', error)
        return { success: false, error: error.message }
      }
    })

    /**
     * 调整会话终端大小
     */
    ipcxMain.handle('terminal:resize-session', async (_event, payload) => {
      try {
        const { sessionId, cols, rows } = payload
        sessionManager.resize(sessionId, cols, rows)
        return { success: true }
      }
      catch (error) {
        console.error('[Terminal Service] Failed to resize session:', error)
        return { success: false, error: error.message }
      }
    })

    /**
     * 销毁会话
     */
    ipcxMain.handle('terminal:destroy-session', async (_event, payload) => {
      try {
        const { sessionId } = payload
        await sessionManager.destroy(sessionId)
        return { success: true }
      }
      catch (error) {
        console.error('[Terminal Service] Failed to destroy session:', error)
        return { success: false, error: error.message }
      }
    })

    // 清理函数
    return () => {
      sessionManager.destroyAll()
      ipcxMain.removeHandler('terminal:create-session')
      ipcxMain.removeHandler('terminal:write-session')
      ipcxMain.removeHandler('terminal:resize-session')
      ipcxMain.removeHandler('terminal:destroy-session')
    }
  },
}
