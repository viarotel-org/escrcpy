import { createWindowManager } from '@escrcpy/electron-modularity/main'

export default {
  name: 'module:main',
  apply(ctx) {
    createWindowManager('main', {
      app: ctx,
      singleton: true,
      mainWindow: true,
      browserWindow: {
        persistenceBounds: true,
      },
      hooks: {
      },
    })
  },
}
