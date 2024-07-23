import { createPinia } from 'pinia'
import { useDeviceStore } from './device/index.js'
import { usePreferenceStore } from './preference/index.js'
import { useThemeStore } from './theme/index.js'
import { useTaskStore } from './task/index.js'

export { useDeviceStore, usePreferenceStore, useThemeStore, useTaskStore }

export default {
  install(app) {
    const store = createPinia()

    app.use(store)

    app.config.globalProperties.$store = {
      device: useDeviceStore(),
      preference: usePreferenceStore(),
      theme: useThemeStore(),
    }
  },
}
