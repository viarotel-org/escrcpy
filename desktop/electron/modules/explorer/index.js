import window from './window.js'
import events from './events.js'
import service from './service.js'

export default {
  name: 'module:explorer',
  order: 100,
  apply(app) {
    app.use(window)
    app.use(events)
    app.use(service)
  },
}
