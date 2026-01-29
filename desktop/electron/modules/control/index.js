import window from './window.js'
import events from './events.js'
import service from './service.js'

export default {
  name: 'module:control',
  apply(app) {
    app.use(window)
    app.use(service)
    app.use(events)
  },
}
