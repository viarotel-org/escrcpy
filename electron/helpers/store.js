import Store from 'electron-store'
import { isEqual } from 'lodash-es'
import { createProxy } from './index.js'

const appStore = new Store()

// 如果没有数据则手动设置值，以保证配置文件生成成功
if (isEqual(appStore.store, {})) {
  appStore.store = {}
}

export default {
  ...createProxy(appStore, [
    'set',
    'get',
    'delete',
    'clear',
    'reset',
    'has',
    'onDidChange',
    'onDidAnyChange',
    'openInEditor',
  ]),
  ...appStore,
  getAll: () => appStore.store,
  setAll: value => (appStore.store = value),
}
