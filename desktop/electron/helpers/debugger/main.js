import electronLog from 'electron-log/main'
import store from '$electron/helpers/store.js'
import { createProxy } from '$electron/helpers/index.js'

const debug = !process.env.IS_PACKAGED ? store.get('common.debug') : false

if (debug) {
  Object.assign(console, createProxy(electronLog.functions, electronLog.levels))
}
