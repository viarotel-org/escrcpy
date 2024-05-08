import 'element-plus/theme-chalk/dark/css-vars.css'
import './restyle.css'

import * as ElementPlusIcons from '@element-plus/icons-vue'

export default {
  install(app) {
    for (const [key, component] of Object.entries(ElementPlusIcons)) {
      app.component(key, component)
    }
  },
}
