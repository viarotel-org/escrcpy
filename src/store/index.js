import { createPinia } from 'pinia'
import persistedState from 'pinia-plugin-persistedstate'
import { useDeviceStore } from './device/index.js'
import { usePreferenceStore } from './preference/index.js'
import { useThemeStore } from './theme/index.js'
import { useTaskStore } from './task/index.js'

export { useDeviceStore, usePreferenceStore, useThemeStore, useTaskStore }

export default {
  install(app) {
    const store = createPinia()

    store.use(persistedState)

    app.use(store)

    app.config.globalProperties.$store = {
      device: useDeviceStore(),
      preference: usePreferenceStore(),
      theme: useThemeStore(),
    }
  },
}
