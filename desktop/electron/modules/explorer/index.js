import window from './window.js'
import service from './service.js'

export default {
  name: 'module:explorer',
  order: 100,
  apply(app) {
    app.use(window)
    app.use(service)
  },
}
