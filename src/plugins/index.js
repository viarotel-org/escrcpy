import ElementPlus from './element-plus/index.js'
import Scrollable from './scrollable/index.js'

export default {
  install(app) {
    app.use(ElementPlus)
    app.use(Scrollable)
  },
}
