import window from './window.js'
import service from './service.js'

export default {
  name: 'module:explorer',
  order: 100,
  apply(mainApp) {
    mainApp.use(window)
    mainApp.use(service)
  },
}
