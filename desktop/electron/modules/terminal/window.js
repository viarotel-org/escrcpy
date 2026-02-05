import { createWindowManager } from '@escrcpy/electron-setup/main'
import { sessionManager } from './session-manager.js'

export default {
  name: 'module:terminal:window',
  apply() {
    createWindowManager('pages/terminal', {
      singleton: false,
      browserWindow: {
        width: 800,
        height: 600,
        minWidth: 400,
        minHeight: 300,
      },
      hooks: {
        beforeClose(win, context) {
          const type = context.payload.type || 'device'
          const instanceId = context.payload.instanceId || context.payload.id

          if (instanceId) {
            const sessionId = `${type}:${instanceId}`
            sessionManager.destroy(sessionId)
            console.log(`[Terminal Window] Cleaned up session: ${sessionId}`)
          }
        },
      },
    })
  },
}
