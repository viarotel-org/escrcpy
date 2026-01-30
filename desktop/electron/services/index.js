import {
  clipboardPlugin,
  executeArgumentsPlugin,
  sandboxPlugin,
  singletonPlugin,
  themePlugin,
  windowIPCPlugin,
} from '@escrcpy/electron-modularity/plugins'

import listeners from './listeners/index.js'
import contextMenu from './context-menu/index.js'
import handles from './handles/index.js'
import shortcuts from './shortcuts/index.js'
import tray from './tray/index.js'
import updater from './updater/index.js'
import launch from './launch/index.js'

export default {
  name: 'services',
  apply(app) {
    app.use(sandboxPlugin)
    app.use(executeArgumentsPlugin)
    app.use(singletonPlugin)
    app.use(clipboardPlugin)

    // Application-specific services
    app.use(listeners)
    app.use(contextMenu)
    app.use(handles)
    app.use(updater)
    app.use(tray)
    app.use(themePlugin)
    app.use(shortcuts)
    app.use(launch)
    app.use(windowIPCPlugin)
  },
}
