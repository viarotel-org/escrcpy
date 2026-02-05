import { createWindowManager } from '@escrcpy/electron-setup/main'

export default {
  name: 'module:explorer:window',
  apply(mainApp) {
    createWindowManager('pages/explorer', {
      singleton: false,
      browserWindow: {
        frame: true,
        titleBarStyle: 'default',
      },
    })
  },
}
