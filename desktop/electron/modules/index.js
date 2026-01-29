import singleton from './singleton/index.js'
import control from './control/index.js'
import copilot from './copilot/index.js'
import explorer from './explorer/index.js'
import window from './window/index.js'

export default {
  name: 'modules',
  apply(app) {
    app.use(singleton)
    app.use(window)
    app.use(control)
    app.use(copilot)
    app.use(explorer)
  },
}
