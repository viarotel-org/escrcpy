import { createWindowManager } from '@escrcpy/electron-setup/main'
import { browserWindowHeight, browserWindowWidth } from '$electron/configs/index.js'
import { copilotService } from './helpers/index.js'

export default {
  name: 'module:copilot:window',
  apply(mainApp) {
    const windowHeight = browserWindowHeight + 90

    createWindowManager('pages/copilot', {
      singleton: false,
      browserWindow: {
        width: browserWindowWidth,
        minWidth: browserWindowWidth,
        height: windowHeight,
        minHeight: windowHeight,
      },
      hooks: {
        beforeClose(win, context) {
          copilotService.destroy(context.payload.instanceId)
        },
      },
    })
  },
}
