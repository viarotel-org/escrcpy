import { createApp, toRaw } from 'vue'
import App from './App.vue'
import { i18n, t } from '@/locales/index.js'
import plugins from '@/plugins/index.js'
import icons from '@/icons/index.js'

import { replaceIP, restoreIP } from '@/utils/index.js'

import 'virtual:uno.css'
import '@/styles/index.js'

const app = createApp(App)

app.use(plugins)

app.use(icons)

app.use(i18n)
window.t = t

app.config.globalProperties.$replaceIP = replaceIP
app.config.globalProperties.$restoreIP = restoreIP

app.config.globalProperties.$toRaw = toRaw

app.config.globalProperties.$mockAPI = ({ imitate = {}, delay = 500 } = {}) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: '0000',
        data: imitate,
        success: true,
      })
    }, delay)
  })

app.mount('#app')
