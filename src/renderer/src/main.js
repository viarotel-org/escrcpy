import { createApp } from 'vue'
import App from './App.vue'

import store from './store/index.js'

import plugins from './plugins/index.js'

import 'virtual:uno.css'
import './styles/index.js'

const app = createApp(App)

app.use(store)

app.use(plugins)

app.config.globalProperties.$electron = window.electron
app.config.globalProperties.$adb = window.adbkit
app.config.globalProperties.$scrcpy = window.scrcpy
app.config.globalProperties.$path = window.nodePath

app.mount('#app')
