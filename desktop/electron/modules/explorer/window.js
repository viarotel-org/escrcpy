import { createWindowManager } from '@escrcpy/electron-modularity/main'

export default {
  name: 'module:explorer:window',
  apply(ctx) {
    createWindowManager('explorer', {
      singleton: false,
      browserWindow: {
        frame: true,
        titleBarStyle: 'default',
      },
    })
  },
}
