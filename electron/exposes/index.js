import path from 'node:path'

import store from '@electron/helpers/store.js'
import * as configs from '@electron/configs/index.js'
import electron from './electron/index.js'
import adbkit from './adbkit/index.js'
import scrcpy from './scrcpy/index.js'

export default {
  init(expose) {
    expose('nodePath', path)

    expose('appStore', store)

    expose('electron', {
      ...electron(),
      configs,
    })

    expose('adbkit', adbkit())
    expose('scrcpy', scrcpy())
  },
}
