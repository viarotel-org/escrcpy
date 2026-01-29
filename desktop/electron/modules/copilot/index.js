import window from './window.js'
import events from './events.js'
import service from './service.js'

const plugins = [
  {
    name: 'module:copilot:window',
    apply(app) {
      return window(app)
    },
  },
  {
    name: 'module:copilot:service',
    apply(app) {
      return service(app)
    },
  },
  {
    name: 'module:copilot:events',
    apply(app) {
      return events(app)
    },
  },
]

export default {
  name: 'module:copilot',
  order: 100,
  apply(app) {
    plugins.forEach((plugin, index) => app.use({
      ...plugin,
      order: plugin.order ?? (index + 1) * 10,
    }))
  },
}
