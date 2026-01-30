import { createWindowManager } from '@escrcpy/electron-modularity'

export default {
  name: 'module:explorer:window',
  apply(app) {
    createWindowManager('explorer', {
      app,
      singleton: false,
      windowOptions: {
        frame: true,
        titleBarStyle: 'default',
      },
    })
  },
}
