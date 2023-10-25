import path from 'node:path'

import log from '@electron/helpers/log.js'
import '@electron/helpers/console.js'

import store from '@electron/helpers/store.js'
import * as configs from '@electron/configs/index.js'

import electron from './electron/index.js'
import adbkit from './adbkit/index.js'
import scrcpy from './scrcpy/index.js'

export default {
  init(expose) {
    expose('nodePath', path)

    expose('appStore', store)

    expose('appLog', log)

    expose('electron', {
      ...electron(),
      configs,
    })

    expose('adbkit', adbkit({ log }))
    expose('scrcpy', scrcpy({ log }))
  },
}
