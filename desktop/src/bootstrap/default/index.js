import '$/utils/console.js'

import icons from '$/icons/index.js'

import { i18n, t } from '$/locales/index.js'

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

  app.use(icons)

  app.use(i18n)
  window.t = t

  install?.(app)

  app.config.globalProperties.$path = window.nodePath
  app.config.globalProperties.$appStore = window.appStore
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
