import { createWindowManager } from '@escrcpy/electron-setup/main'
import { trySend } from '$electron/helpers/index.js'

export default {
  name: 'module:control:window',
  apply(mainApp) {
    createWindowManager('entries/control', {
      singleton: true,
      browserWindow: {
        frame: false,
        titleBarStyle: 'default',
        transparent: true,
        backgroundColor: '#00000000',
        width: 420,
        minWidth: 420,
        height: 28,
        maxHeight: 28,
        minHeight: 28,
        alwaysOnTop: true,
        skipTaskbar: true,
      },
      hooks: {
        shown(win, { payload }) {
          trySend(win, 'device-change', payload.query)
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
