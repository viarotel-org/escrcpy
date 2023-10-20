import Store from 'electron-store'
import { createProxy } from './index.js'

const appStore = new Store()

appStore.onDidAnyChange((value) => {
  console.log('appStore.onDidAnyChange.value', value)
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
