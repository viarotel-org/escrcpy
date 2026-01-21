import Store from 'electron-store'
import { isEqual, set } from 'lodash-es'
import { createProxy } from '$electron/helpers/index.js'

export function createStore(options = {}) {
  const store = new Store({
    watch: true,
    ...options,
  })

  if (isEqual(store.store, {})) {
    store.store = {}
  }

  return resolveStore(store)
}

export function resolveStore(store) {
  return {
    ...createProxy(store, [
      'get',
      'delete',
      'clear',
      'reset',
      'has',
      'onDidChange',
      'onDidAnyChange',
      'openInEditor',
    ]),

    getPath: () => store.path,

    getAll: () => store.store,

    setAll: value => (store.store = value),

    set(...args) {
      if (Array.isArray(args[0])) {
        const tempStore = { ...store.store }

        set(tempStore, args[0], args[1])

        store.set(tempStore)

        return false
      }

      store.set(...args)
    },
  }
}
