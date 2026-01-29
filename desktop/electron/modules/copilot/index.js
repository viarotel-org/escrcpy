import window from './window.js'
import service from './service.js'

export default {
  name: 'module:copilot',
  apply(app) {
    app.use(window)
    app.use(service)
  },
}
