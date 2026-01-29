import control from './control/index.js'
import copilot from './copilot/index.js'
import explorer from './explorer/index.js'
import main from './main/index.js'

export default {
  name: 'modules',
  apply(app) {
    app.use(main)
    app.use(control)
    app.use(copilot)
    app.use(explorer)
  },
}
