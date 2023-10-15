import path from 'node:path'
import electron from './electron/index.js'
import adbkit from './adbkit/index.js'
import scrcpy from './scrcpy/index.js'

export default {
  install(expose) {
    expose('nodePath', path)
    expose('electron', electron())
    expose('adbkit', adbkit())
    expose('scrcpy', scrcpy())
  },
}
