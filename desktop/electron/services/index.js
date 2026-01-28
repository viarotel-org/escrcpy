import appEvents from './app/index.js'
import handles from './handles/index.js'
import shortcuts from './shortcuts/index.js'
import theme from './theme/index.js'
import tray from './tray/index.js'
import updater from './updater/index.js'
import launch from './launch/index.js'
import window from './window/index.js'

const plugins = [
  {
    name: 'service:app-events',
    order: 10,
    apply(app) {
      return appEvents(app)
    },
  },
  {
    name: 'service:handles',
    order: 20,
    apply(app) {
      return handles(app)
    },
  },
  {
    name: 'service:updater',
    deps: ['module:window'],
    order: 30,
    apply(app) {
      return updater(app)
    },
  },
  {
    name: 'service:tray',
    deps: ['module:window'],
    order: 40,
    apply(app) {
      return tray(app)
    },
  },
  {
    name: 'service:theme',
    order: 50,
    apply(app) {
      return theme(app)
    },
  },
  {
    name: 'service:shortcuts',
    order: 60,
    apply(app) {
      return shortcuts(app)
    },
  },
  {
    name: 'service:launch',
    order: 70,
    apply(app) {
      return launch(app)
    },
  },
  {
    name: 'service:window',
    deps: ['modules'],
    order: 80,
    apply(app) {
      return window(app)
    },
  },
]

export default {
  name: 'services',
  order: 100,
  apply(app) {
    plugins.forEach(plugin => app.use(plugin))
  },
}
