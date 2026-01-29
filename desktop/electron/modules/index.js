import singleton from './singleton/index.js'
import control from './control/index.js'
import controlService from './control/service.js'
import copilot from './copilot/index.js'
import copilotService from './copilot/service.js'
import explorer from './explorer/index.js'
import explorerService from './explorer/service.js'
import window from './window/index.js'

export default {
  name: 'modules',
  order: 10,
  apply(app) {
    app.use(singleton)
    app.use(window)
    app.use(control)
    app.use(controlService)
    app.use(copilot)
    app.use(copilotService)
    app.use(explorer)
    app.use(explorerService)
  },
}
