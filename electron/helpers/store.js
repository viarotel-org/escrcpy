import Store from 'electron-store'
import { isEqual, set } from 'lodash-es'
import { createProxy } from './index.js'

const appStore = new Store({ watch: true })

// 如果没有数据则手动设置值，以保证配置文件生成成功
if (isEqual(appStore.store, {})) {
  appStore.store = {}
}

export default {
  ...createProxy(appStore, [
    'get',
    'delete',
    'clear',
    'reset',
    'has',
    'onDidChange',
    'onDidAnyChange',
    'openInEditor',
  ]),

  getAll: () => appStore.store,
  setAll: value => (appStore.store = value),

  set(...args) {
    if (Array.isArray(args[0])) {
      const tempStore = { ...appStore.store }

      set(tempStore, args[0], args[1])

      appStore.set(tempStore)

      return false
    }

    appStore.set(...args)
  },
}
