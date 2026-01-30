import { createWindowManager } from '@escrcpy/electron-modularity/main'

export default {
  name: 'module:main',
  apply(app) {
    createWindowManager('main', {
      app,
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
