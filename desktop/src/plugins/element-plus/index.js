import * as ElementPlusIcons from '@element-plus/icons-vue'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import ExFormItemCol from './expands/ExFormItemCol/index.vue'
import ExFormRow from './expands/ExFormRow/index.vue'

import ExIconLoading from './expands/ExIconLoading/index.vue'
import ExTagCollapse from './expands/ExTagCollapse/index.vue'

import ExTagDict from './expands/ExTagDict/index.vue'

import ExTooltipButton from './expands/ExTooltipButton/index.vue'

import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-badge.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './restyle.css'

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
        icon: ExIconLoading,
      })

    app.use(ElMessage)
    app.use(ElMessageBox)
    app.use(ElLoading)

    app.component('ExFormRow', ExFormRow)
    app.component('ExFormItemCol', ExFormItemCol)
    app.component('ExTooltipButton', ExTooltipButton)
    app.component('ExTagDict', ExTagDict)
    app.component('ExTagCollapse', ExTagCollapse)
  },
}
