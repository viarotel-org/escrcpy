import window from './window.js'
import service from './service.js'

export default {
  name: 'module:control',
  apply(app) {
    app.use(window)
    app.use(service)
  },
}
