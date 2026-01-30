import window from './window.js'
import service from './service.js'

export default {
  name: 'module:control',
  apply(mainApp) {
    mainApp.use(window)
    mainApp.use(service)
  },
}