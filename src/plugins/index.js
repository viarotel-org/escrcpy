import ElementPlus from './element-plus/index.js'
import Scrollable from './scrollable/index.js'
import VueScreen from './vue-screen/index.js'
import VueSwapy from './vue-swapy/index.js'

export default {
  install(app) {
    app.use(ElementPlus)
    app.use(Scrollable)
    app.use(VueScreen)
    app.use(VueSwapy)
  },
}
