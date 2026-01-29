import listeners from './listeners/index.js'
import clipboard from './clipboard/index.js'
import contextMenu from './context-menu/index.js'
import executeArguments from './execute-arguments/index.js'
import handles from './handles/index.js'
import sandbox from './sandbox/index.js'
import shortcuts from './shortcuts/index.js'
import singleton from './singleton/index.js'
import theme from './theme/index.js'
import tray from './tray/index.js'
import updater from './updater/index.js'
import launch from './launch/index.js'
import window from './window/index.js'

export default {
  name: 'services',
  apply(app) {
    app.use(sandbox)
    app.use(executeArguments)
    app.use(singleton)
    app.use(listeners)
    app.use(contextMenu)
    app.use(clipboard)
    app.use(handles)
    app.use(updater)
    app.use(tray)
    app.use(theme)
    app.use(shortcuts)
    app.use(launch)
    app.use(window)
  },
}
