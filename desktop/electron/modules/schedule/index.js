import service from './service.js'

export default {
  name: 'module:schedule',
  apply(mainApp) {
    mainApp.use(service)
  },
}
