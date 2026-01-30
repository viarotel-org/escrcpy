import window from './window.js'
import service from './service.js'

export default {
  name: 'module:copilot',
  apply(mainApp) {
    mainApp.use(window)
    mainApp.use(service)
  },
}
