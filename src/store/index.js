import { createPinia } from 'pinia'
import { useScrcpyStore } from './scrcpy/index.js'
import { useDeviceStore } from './device/index.js'

export { useScrcpyStore, useDeviceStore }

export default {
  install(app) {
    const store = createPinia()

    app.use(store)
    app.config.globalProperties.$store = {
      scrcpy: useScrcpyStore(),
      device: useDeviceStore(),
    }
  },
}
