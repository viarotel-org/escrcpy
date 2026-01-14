import electronLog from 'electron-log/main'
import electronStore from '$electron/helpers/store/index.js'
import { createProxy } from '$electron/helpers/index.js'

const debug = !process.env.IS_PACKAGED ? electronStore.get('common.debug') : false

if (debug) {
  Object.assign(console, createProxy(electronLog.functions, electronLog.levels))
}
