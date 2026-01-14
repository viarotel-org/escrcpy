import '$electron/helpers/debugger/renderer.js'
import path from 'node:path'
import store from '$electron/helpers/store/index.js'
import adb from './adb/index.js'
import electron from './electron/index.js'
import gnirehtet from './gnirehtet/index.js'
import scrcpy from './scrcpy/index.js'
import search from './search/index.js'
import desktop from './desktop/index.js'
import terminal from './terminal/index.js'

export default {
  init(expose) {
    adb.init()

    expose('nodePath', path)

    expose('electronStore', store)

    expose('electron', electron)

    expose('adb', adb)

    expose('scrcpy', scrcpy)

    expose('gnirehtet', gnirehtet)

    expose('findInPageModal', search)

    expose('desktop', desktop)

    expose('terminal', terminal)
  },
}
