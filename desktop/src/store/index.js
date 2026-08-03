import { createPinia } from 'pinia'
import persistedState from 'pinia-plugin-persistedstate'

let store

export default {
  install(app) {
    if (!store) {
      store = createPinia()
    }

    store.use(persistedState)

    app.use(store)
  },
}
