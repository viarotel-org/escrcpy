import { createWindowManager } from '$electron/helpers/core/index.js'
import { browserWindowWidth } from '$electron/configs/index.js'

export default {
  name: 'module:copilot:window',
  apply(app) {
    createWindowManager('copilot', {
      app,
      singleton: false,
      windowOptions: {
        preloadDir: app.preloadDir,
        width: browserWindowWidth,
        minWidth: browserWindowWidth,
        height: browserWindowWidth * 0.7,
        minHeight: browserWindowWidth * 0.7,
      },
      beforeClose(win) {
        win.webContents.send('copilot-window-closing')
      },
    })
  },
}
