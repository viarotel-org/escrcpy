import path from 'node:path'

import * as configs from '$electron/configs/index.js'
import appLog from '$electron/helpers/log.js'
import store from '$electron/helpers/store.js'
import adbkit from './adbkit/index.js'
import electron from './electron/index.js'
import gnirehtet from './gnirehtet/index.js'
import scrcpy from './scrcpy/index.js'
import search from './search/index.js'
import '$electron/helpers/console.js'

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

    expose('findInPageModal', search())
  },
}
