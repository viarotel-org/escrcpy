import { createPinia } from 'pinia'
import { useScrcpyStore } from './scrcpy/index.js'

export { useScrcpyStore }

export default {
  install(app) {
    const store = createPinia()

    app.use(store)
    app.config.globalProperties.$store = {
      scrcpy: useScrcpyStore(),
    }
  },
}
