import { createWindowManager } from '@escrcpy/electron-modularity/main'

export default {
  name: 'module:explorer:window',
  apply(ctx) {
    createWindowManager('explorer', {
      app: ctx,
      singleton: false,
      browserWindow: {
        frame: true,
        titleBarStyle: 'default',
      },
    })
  },
}
