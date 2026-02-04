import { createWindowManager } from '@escrcpy/electron-setup/main'

export default {
  name: 'module:terminal:window',
  apply(mainApp) {
    createWindowManager('entries/terminal', {
      singleton: false,
      browserWindow: {
        frame: true,
        titleBarStyle: 'default',
      },
    })
  },
}
