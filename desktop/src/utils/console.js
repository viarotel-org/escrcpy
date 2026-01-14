import electronLog from 'electron-log/renderer'

const debug = import.meta.env.MODE === 'production' ? window.electronStore.get('common.debug') : false

if (debug) {
  Object.assign(console, electronLog.functions)
}
