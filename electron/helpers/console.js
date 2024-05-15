import appStore from './store.js'
import { createProxy } from './index.js'
import log from '$electron/helpers/log.js'

const debug = appStore.get('common.debug') || false

if (debug) {
  Object.assign(console, {
    ...createProxy(log.functions, log.levels),
    raw: console.log,
  })
}
