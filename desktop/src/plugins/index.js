import VueI18n from './vue-i18n/index.js'
import ElementPlus from './element-plus/index.js'
import FileIcon from './file-icon/index.js'
import Scrollable from './scrollable/index.js'
import VueScreen from './vue-screen/index.js'
import VueSwapy from './vue-swapy/index.js'
import Platform from './platform/index.js'

export default {
  install(app) {
    app.use(VueI18n)
    app.use(ElementPlus)
    app.use(FileIcon)
    app.use(Scrollable)
    app.use(VueScreen)
    app.use(VueSwapy)
    app.use(Platform)
  },
}
