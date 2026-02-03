import '$/utils/console.js'

import plugins from '$/plugins/index.js'

import store from '$/store/index.js'

import { isPlatform } from '$/utils/index.js'

import 'virtual:uno.css'

import '$/styles/index.js'

export default (App, { router, install } = {}) => {
  const app = createApp(App)

  if (router) {
    app.use(router)
  }

  app.use(store)

  app.use(plugins)

  install?.(app)

  app.config.globalProperties.$path = window.nodePath
  app.config.globalProperties.$electronStore = window.electronStore
  app.config.globalProperties.$electron = window.electron

  app.config.globalProperties.$adb = window.adb
  app.config.globalProperties.$scrcpy = window.scrcpy
  app.config.globalProperties.$gnirehtet = window.gnirehtet

  app.config.globalProperties.$desktop = window.desktop

  app.config.globalProperties.$toRaw = toRaw

  app.mount('#app').$nextTick(() => {
    // Remove Preload scripts loading
    postMessage({ payload: 'removeLoading' }, '*')

    const root = document.documentElement

    // Add platform-specific class to the root element
    ;(['macos', 'windows', 'linux']).forEach((platform) => {
      if (isPlatform(platform)) {
        root.classList.add(`${platform}-platform`)
      }
    })
  })

  return app
}
