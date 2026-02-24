import { ipcxMain } from '@escrcpy/electron-ipcx/main'
import { sessionManager } from './helpers/index.js'

export default {
  name: 'module:terminal:service',
  apply(mainApp) {
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

    return () => {
      sessionManager.destroyAll()
      ipcxMain.removeHandler('terminal:create-session')
      ipcxMain.removeHandler('terminal:write-session')
      ipcxMain.removeHandler('terminal:resize-session')
      ipcxMain.removeHandler('terminal:destroy-session')
    }
  },
}
