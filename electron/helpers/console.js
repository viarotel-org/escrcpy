import log from '$electron/helpers/log.js'
import { createProxy } from './index.js'
import appStore from './store.js'

const debug = appStore.get('common.debug') || false

if (debug) {
  Object.assign(console, {
    ...createProxy(log.functions, log.levels),
    raw: console.log,
  })
}
