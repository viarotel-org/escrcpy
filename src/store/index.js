import { createPinia } from 'pinia'
import { useScrcpyStore } from './scrcpy/index.js'
import { useDeviceStore } from './device/index.js'
import { usePreferenceStore } from './preference/index.js'

export { useScrcpyStore, useDeviceStore, usePreferenceStore }

export default {
  install(app) {
    const store = createPinia()

    app.use(store)

    app.config.globalProperties.$store = {
      scrcpy: useScrcpyStore(),
      device: useDeviceStore(),
      preference: usePreferenceStore(),
    }
  },
}
