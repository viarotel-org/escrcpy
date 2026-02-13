import electronLog from 'electron-log/renderer'
import electronStore from '$electron/helpers/store/index.js'

const debug = import.meta.env.MODE === 'production' ? electronStore.get('common.debug') : false

if (debug) {
  Object.assign(console, electronLog.functions)
}
