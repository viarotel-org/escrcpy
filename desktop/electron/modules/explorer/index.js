import { createWindowManager } from '$electron/helpers/core/index.js'

export default {
  name: 'module:explorer',
  apply(app) {
    createWindowManager('explorer', {
      app,
      singleton: false,
      load(win, context) {
        win.loadPage?.('explorer', context?.payload)
      },
      windowOptions: {
        preloadDir: app.preloadDir,
        frame: true,
        titleBarStyle: 'default',
      },
    })
  },
}
