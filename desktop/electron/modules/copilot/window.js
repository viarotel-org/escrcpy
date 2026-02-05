import { createWindowManager } from '@escrcpy/electron-setup/main'
import { browserWindowWidth } from '$electron/configs/index.js'
import { copilotService } from './helpers/index.js'

export default {
  name: 'module:copilot:window',
  apply(mainApp) {
    createWindowManager('pages/copilot', {
      singleton: false,
      browserWindow: {
        persistenceBounds: true,
        width: browserWindowWidth,
        minWidth: browserWindowWidth,
        height: browserWindowWidth * 0.7,
        minHeight: browserWindowWidth * 0.7,
      },
      hooks: {
        beforeClose(win, context) {
          copilotService.destroy(context.payload.instanceId)
        },
      },
    })
  },
}
