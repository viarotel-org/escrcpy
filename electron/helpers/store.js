import Store from 'electron-store'
import { createProxy } from './index.js'

const appStore = new Store()

appStore.onDidAnyChange(() => {
  console.log('appStore.onDidAnyChange', appStore.store)
})

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
