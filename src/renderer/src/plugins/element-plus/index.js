import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './restyle.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export default {
  install(app) {
    app.use(ElementPlus)

    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
