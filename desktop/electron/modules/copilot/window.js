import { createWindowManager } from '$electron/helpers/core/index.js'
import { browserWindowWidth } from '$electron/configs/index.js'

export default (app) => {
  createWindowManager('copilot', {
    app,
    singleton: false,
    load(win, context) {
      win.loadPage?.('copilot', context?.payload)
    },
    windowOptions: {
      preloadDir: app.preloadDir,
      width: browserWindowWidth,
      minWidth: browserWindowWidth,
      height: browserWindowWidth * 0.7,
      minHeight: browserWindowWidth * 0.7,
    },
  })
}
