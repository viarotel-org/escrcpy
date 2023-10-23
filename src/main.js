import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'
import App from './App.vue'

import store from './store/index.js'

import plugins from './plugins/index.js'
import icons from './icons/index.js'

import { replaceIP } from '@/utils/index.js'

import 'virtual:uno.css'
import './styles/index.js'

const app = createApp(App)

app.use(store)

app.use(plugins)

app.use(icons)

const locale = window.electron?.process?.env?.LOCALE
// const locale = 'en_US'
// console.log('locale', locale)
const i18n = createI18n({
  locale,
  messages,
})
app.use(i18n)

app.config.globalProperties.$electron = window.electron
app.config.globalProperties.$adb = window.adbkit
app.config.globalProperties.$scrcpy = window.scrcpy
app.config.globalProperties.$path = window.nodePath
app.config.globalProperties.$appStore = window.appStore

app.config.globalProperties.$replaceIP = replaceIP

console.log('electron', window.electron)

app.mount('#app').$nextTick(() => {
  // Remove Preload scripts loading
  postMessage({ payload: 'removeLoading' }, '*')
})
