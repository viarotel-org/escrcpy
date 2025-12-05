import ElementPlus from './element-plus/index.js'
import FileIcon from './file-icon/index.js'
import Scrollable from './scrollable/index.js'
import VueScreen from './vue-screen/index.js'
import VueSwapy from './vue-swapy/index.js'

export default {
  install(app) {
    app.use(ElementPlus)
    app.use(FileIcon)
    app.use(Scrollable)
    app.use(VueScreen)
    app.use(VueSwapy)
  },
}
