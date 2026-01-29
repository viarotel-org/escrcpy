import window from './window.js'
import events from './events.js'
import service from './service.js'

const plugins = [
  {
    name: 'module:explorer:window',
    apply(app) {
      return window(app)
    },
  },
  {
    name: 'module:explorer:service',
    apply(app) {
      return service(app)
    },
  },
  {
    name: 'module:explorer:events',
    apply(app) {
      return events(app)
    },
  },
]

export default {
  name: 'module:explorer',
  order: 100,
  apply(app) {
    plugins.forEach((plugin, index) => app.use({
      ...plugin,
      order: plugin.order ?? (index + 1) * 10,
    }))
  },
}
