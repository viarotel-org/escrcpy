import { createPinia } from 'pinia'
import persistedState from 'pinia-plugin-persistedstate'

export default {
  install(app) {
    const store = createPinia()

    store.use(persistedState)

    app.use(store)
  },
}
