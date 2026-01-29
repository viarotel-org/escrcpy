import { createWindowManager } from '$electron/helpers/core/index.js'

export default (app) => {
  createWindowManager('control', {
    app,
    load(win) {
      win.loadPage?.('control')
    },
    windowOptions: {
      preloadDir: app.preloadDir,
      frame: false,
      transparent: true,
      backgroundColor: '#00000000',
      width: 700,
      minWidth: 700,
      height: 28,
      maxHeight: 28,
      alwaysOnTop: true,
      skipTaskbar: true,
    },
  })
}
