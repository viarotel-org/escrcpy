import { createWindowManager } from '@escrcpy/electron-modularity/main'
import { browserWindowWidth } from '$electron/configs/index.js'
import { copilotService } from './helpers/index.js'

export default {
  name: 'module:copilot:window',
  apply(app) {
    createWindowManager('copilot', {
      app,
      singleton: false,
      windowOptions: {
        persistenceBounds: true,
        width: browserWindowWidth,
        minWidth: browserWindowWidth,
        height: browserWindowWidth * 0.7,
        minHeight: browserWindowWidth * 0.7,
      },
      hooks: {
        beforeClose(win, ctx) {
          copilotService.destroy(ctx.payload.instanceId)
        },
      },
    })
  },
}
