import { createWindowManager } from '$electron/helpers/core/index.js'

export default {
  name: 'module:explorer:window',
  apply(app) {
    createWindowManager('explorer', {
      app,
      singleton: false,
      windowOptions: {
        preloadDir: app.preloadDir,
        frame: true,
        titleBarStyle: 'default',
      },
    })
  },
}
