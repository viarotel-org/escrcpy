import { createPinia } from 'pinia'
import { useDeviceStore } from './device/index.js'
import { usePreferenceStore } from './preference/index.js'

export { useDeviceStore, usePreferenceStore }

export default {
  install(app) {
    const store = createPinia()

    app.use(store)

    app.config.globalProperties.$store = {
      device: useDeviceStore(),
      preference: usePreferenceStore(),
    }
  },
}
