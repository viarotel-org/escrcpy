import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-badge.css'

import 'element-plus/theme-chalk/dark/css-vars.css'
import './restyle.css'

import * as ElementPlusIcons from '@element-plus/icons-vue'

import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'

import EleIconLoading from './components/EleIconLoading/index.vue'

export default {
  install(app) {
    for (const [key, component] of Object.entries(ElementPlusIcons)) {
      app.component(key, component)
    }

    ElMessage.loading = (message, options = {}) =>
      ElMessage({
        duration: 0,
        ...options,
        message,
        icon: EleIconLoading,
      })

    app.use(ElMessage)
    app.use(ElMessageBox)
    app.use(ElLoading)
  },
}
