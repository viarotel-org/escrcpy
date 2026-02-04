import window from './window.js'
import service from './service.js'

export default {
  name: 'module:terminal',
  order: 100,
  apply(mainApp) {
    mainApp.use(window)
    mainApp.use(service)
  },
}
