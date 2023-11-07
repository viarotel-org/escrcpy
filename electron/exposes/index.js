import path from 'node:path'

import appLog from '@electron/helpers/log.js'
import '@electron/helpers/console.js'

import store from '@electron/helpers/store.js'
import * as configs from '@electron/configs/index.js'

import electron from './electron/index.js'
import adbkit from './adbkit/index.js'
import scrcpy from './scrcpy/index.js'
import gnirehtet from './gnirehtet/index.js'

export default {
  init(expose) {
    expose('nodePath', path)

    expose('appLog', appLog)

    expose('appStore', store)

    expose('electron', {
      ...electron(),
      configs,
    })

    const adbkitExecute = adbkit()

    expose('adbkit', adbkitExecute)

    expose('scrcpy', scrcpy({ adbkit: adbkitExecute }))

    expose('gnirehtet', gnirehtet({ adbkit: adbkitExecute }))
  },
}
