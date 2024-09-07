import * as ElementPlusIcons from '@element-plus/icons-vue'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import EleFormItemCol from './expands/EleFormItemCol/index.vue'
import EleFormRow from './expands/EleFormRow/index.vue'

import EleIconLoading from './expands/EleIconLoading/index.vue'
import EleTagCollapse from './expands/EleTagCollapse/index.vue'

import EleTagDict from './expands/EleTagDict/index.vue'

import EleTooltipButton from './expands/EleTooltipButton/index.vue'

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
        icon: EleIconLoading,
      })

    app.use(ElMessage)
    app.use(ElMessageBox)
    app.use(ElLoading)

    app.component('EleFormRow', EleFormRow)
    app.component('EleFormItemCol', EleFormItemCol)
    app.component('EleTooltipButton', EleTooltipButton)
    app.component('EleTagDict', EleTagDict)
    app.component('EleTagCollapse', EleTagCollapse)
  },
}
