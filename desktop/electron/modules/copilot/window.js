import { createWindowManager, encodePayload } from '@escrcpy/electron-setup/main'
import { browserWindowWidth } from '$electron/configs/index.js'
import { copilotService } from './helpers/index.js'

export default {
  name: 'module:copilot:window',
  apply(mainApp) {
    const browserWindowHeight = browserWindowWidth * 0.7

    createWindowManager('pages/copilot', {
      singleton: false,
      browserWindow: {
        persistenceBounds: true,
        width: browserWindowWidth,
        minWidth: browserWindowWidth,
        height: browserWindowHeight,
        minHeight: browserWindowHeight,
        webPreferences: {
          additionalArguments: [`--payload=${encodePayload({ browserWindowHeight })}`],
        },
      },
      hooks: {
        beforeClose(win, context) {
          copilotService.destroy(context.payload.instanceId)
        },
      },
    })
  },
}
