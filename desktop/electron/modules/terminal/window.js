import { createWindowManager } from '@escrcpy/electron-setup/main'
import { shellManager } from './helpers/index.js'

export default {
  name: 'module:terminal:window',
  apply(mainApp) {
    createWindowManager('pages/terminal', {
      singleton: false,
      browserWindow: {},
      hooks: {
        beforeClose(win, context) {
          const deviceId = context.payload.id
          if (deviceId) {
            shellManager.destroyByDevice(deviceId)
          }
        },
      },
    })
  },
}
