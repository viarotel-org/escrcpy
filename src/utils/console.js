import { createProxy } from './index.js'

const debug = window.appStore.get('common.debug') || false

if (debug) {
  Object.assign(console, {
    ...createProxy(window.appLog.functions, window.appLog.levels),
    raw: console.log,
  })
}
