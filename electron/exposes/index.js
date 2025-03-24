import path from 'node:path'

import * as configs from '$electron/configs/index.js'
import appLog from '$electron/helpers/log.js'
import store from '$electron/helpers/store.js'
import adb from './adb/index.js'
import electron from './electron/index.js'
import gnirehtet from './gnirehtet/index.js'
import scrcpy from './scrcpy/index.js'
import search from './search/index.js'
import desktop from './desktop/index.js'
import '$electron/helpers/console.js'

export default {
  init(expose) {
    adb.init()

    expose('nodePath', path)

    expose('appLog', appLog)

    expose('appStore', store)

    expose('electron', {
      ...electron(),
      configs,
    })

    expose('adb', adb)

    expose('scrcpy', scrcpy)

    expose('gnirehtet', gnirehtet)

    expose('findInPageModal', search)

    expose('desktop', desktop)
  },
}
