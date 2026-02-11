import { createWindowManager } from '@escrcpy/electron-setup/main'
import { trySend } from '$electron/helpers/index.js'
import { controlBarHeight } from '$control/configs/index.js'

export default {
  name: 'module:control:window',
  apply(mainApp) {
    const browserWindowHeight = controlBarHeight

    createWindowManager('pages/control', {
      singleton: true,
      browserWindow: {
        frame: false,
        titleBarStyle: 'default',
        transparent: true,
        backgroundColor: '#00000000',
        minWidth: 420,
        height: browserWindowHeight,
        maxHeight: browserWindowHeight,
        minHeight: browserWindowHeight,
        alwaysOnTop: true,
        skipTaskbar: true,
      },
      hooks: {
        shown(win, { payload }) {
          trySend(win, 'device-change', payload.device)
        },
        focus(win) {
          trySend(win, 'window-focus', true)
        },
        blur(win) {
          trySend(win, 'window-focus', false)
        },
      },
    })
  },
}
