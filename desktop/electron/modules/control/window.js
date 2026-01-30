import { createWindowManager } from '@escrcpy/electron-modularity'

export default {
  name: 'module:control:window',
  apply(app) {
    createWindowManager('control', {
      app,
      singleton: true,
      windowOptions: {
        frame: false,
        titleBarStyle: 'default',
        transparent: true,
        backgroundColor: '#00000000',
        width: 700,
        minWidth: 700,
        height: 28,
        maxHeight: 28,
        minHeight: 28,
        alwaysOnTop: true,
        skipTaskbar: true,
      },
      hooks: {
        shown(win, { payload }) {
          win.webContents.send('device-change', payload.query)
        },
        focus(win) {
          win.webContents.send('window-focus', true)
        },
        blur(win) {
          win.webContents.send('window-focus', false)
        },
      },
    })
  },
}
