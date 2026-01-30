import { createWindowManager } from '@escrcpy/electron-setup/main'

export default {
  name: 'module:main',
  apply(mainApp) {
    createWindowManager('main', {
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
