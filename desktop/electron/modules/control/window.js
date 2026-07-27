import { createWindowManager } from '@escrcpy/electron-setup/main'
import { trySend } from '$electron/helpers/index.js'
import { controlBarWidth, controlWindowHeight } from '$control/configs/index.js'
import {
  closeEmbeddedWindow,
  disposeEmbeddedWindow,
  embedNativeWindow,
} from './native-container.js'

export default {
  name: 'module:control:window',
  apply(mainApp) {
    createWindowManager('pages/control', {
      singleton: true,
      browserWindow: ({ payload }) => payload.targetWindowTitle
        ? {
            frame: false,
            // The renderer is transparent so the native scrcpy child remains
            // visible behind the mapping editor's translucent overlay.
            transparent: true,
            backgroundColor: '#00000000',
            width: 960,
            minWidth: 360,
            height: 640,
            minHeight: 240,
            show: false,
          }
        : {
            frame: false,
            transparent: true,
            backgroundColor: '#00000000',
            width: controlBarWidth,
            minWidth: controlBarWidth,
            maxWidth: 408,
            height: controlWindowHeight,
            minHeight: 120,
            alwaysOnTop: true,
            skipTaskbar: true,
          },
      hooks: {
        async created(win, { payload }) {
          await embedNativeWindow(win, payload)
        },
        shown(win, { payload }) {
          trySend(win, 'device-change', payload.device)
        },
        beforeClose(win) {
          closeEmbeddedWindow(win)
        },
        closed(win) {
          disposeEmbeddedWindow(win)
        },
      },
    })

    createWindowManager('mapping-popover', {
      singleton: true,
      browserWindow: {
        frame: false,
        transparent: true,
        backgroundColor: '#00000000',
        width: 300,
        height: 120,
        resizable: false,
        skipTaskbar: true,
        show: false,
      },
    })

    createWindowManager('control-overlay', {
      singleton: true,
      browserWindow: {
        frame: false,
        transparent: true,
        backgroundColor: '#00000000',
        width: 640,
        height: 480,
        resizable: false,
        focusable: false,
        skipTaskbar: true,
        show: false,
      },
    })
  },
}
