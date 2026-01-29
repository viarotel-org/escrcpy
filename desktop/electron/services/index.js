import listeners from './listeners/index.js'
import clipboard from './clipboard/index.js'
import contextMenu from './context-menu/index.js'
import executeArguments from './execute-arguments/index.js'
import handles from './handles/index.js'
import sandbox from './sandbox/index.js'
import shortcuts from './shortcuts/index.js'
import theme from './theme/index.js'
import tray from './tray/index.js'
import updater from './updater/index.js'
import launch from './launch/index.js'
import window from './window/index.js'

const plugins = [
  {
    name: 'service:sandbox',
    order: -100,
    apply(app) {
      return sandbox(app)
    },
  },
  {
    name: 'service:context-menu',
    apply(app) {
      return contextMenu(app)
    },
  },
  {
    name: 'service:listeners',
    apply(app) {
      return listeners(app)
    },
  },
  {
    name: 'service:execute-arguments',
    apply(app) {
      return executeArguments(app)
    },
  },
  {
    name: 'service:clipboard',
    apply(app) {
      return clipboard(app)
    },
  },
  {
    name: 'service:handles',
    apply(app) {
      return handles(app)
    },
  },
  {
    name: 'service:updater',
    deps: ['module:window'],
    apply(app) {
      return updater(app)
    },
  },
  {
    name: 'service:tray',
    deps: ['module:window'],
    apply(app) {
      return tray(app)
    },
  },
  {
    name: 'service:theme',
    apply(app) {
      return theme(app)
    },
  },
  {
    name: 'service:shortcuts',
    apply(app) {
      return shortcuts(app)
    },
  },
  {
    name: 'service:launch',
    apply(app) {
      return launch(app)
    },
  },
  {
    name: 'service:window',
    deps: ['modules'],
    apply(app) {
      return window(app)
    },
  },
]

export default {
  name: 'services',
  order: 100,
  apply(app) {
    plugins.forEach((plugin, index) => app.use({
      ...plugin,
      order: plugin.order ?? (index + 1) * 10,
    }))
  },
}
