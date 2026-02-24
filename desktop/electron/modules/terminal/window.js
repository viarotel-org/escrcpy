import { createWindowManager } from '@escrcpy/electron-setup/main'
import { sessionManager } from './helpers/index.js'

export default {
  name: 'module:terminal:window',
  apply() {
    createWindowManager('pages/terminal', {
      singleton: false,
      browserWindow: {},
      hooks: {
        beforeClose(win, context) {
          const type = context.payload.type || 'device'
          const instanceId = context.payload.instanceId || context.payload.id

          if (instanceId) {
            const sessionId = `${type}:${instanceId}`
            sessionManager.destroy(sessionId)
          }
        },
      },
    })
  },
}
