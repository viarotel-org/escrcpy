import { createApp } from 'vue'
import App from './App.vue'

import plugins from './plugins/index.js'

import 'virtual:uno.css'
import './styles/index.js'

const app = createApp(App)

app.use(plugins)

app.config.globalProperties.$electron = window.electron
app.config.globalProperties.$adb = window.adbkit()
app.config.globalProperties.$scrcpy = window.scrcpy()

app.mount('#app')
