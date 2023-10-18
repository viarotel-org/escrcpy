import Store from 'electron-store'
import { createProxy } from '@electron/helpers/index'

export default () => {
  const appStore = new Store()

  appStore.onDidAnyChange(() => {
    console.log('reload.appStore.onDidAnyChange', appStore.store)
  })

  return {
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
}
