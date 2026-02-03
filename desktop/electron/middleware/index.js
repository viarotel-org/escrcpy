import { contextBridge } from 'electron'

import useLoading from './loading/index.js'

import '$electron/helpers/debugger/renderer.js'

import path from 'node:path'
import store from '$electron/helpers/store/index.js'
import i18n from '$electron/helpers/i18n/index.js'
import adb from './adb/index.js'
import electron from './electron/index.js'
import gnirehtet from './gnirehtet/index.js'
import scrcpy from './scrcpy/index.js'
import search from './search/index.js'
import desktop from './desktop/index.js'
import terminal from './terminal/index.js'

export function createMiddleware() {
  adb.init()

  useLoading()

  defineMiddleware('nodePath', path)

  defineMiddleware('electronStore', store)

  defineMiddleware('i18n', i18n)

  defineMiddleware('electron', electron)

  defineMiddleware('adb', adb)

  defineMiddleware('scrcpy', scrcpy)

  defineMiddleware('gnirehtet', gnirehtet)

  defineMiddleware('findInPageModal', search)

  defineMiddleware('desktop', desktop)

  defineMiddleware('terminal', terminal)
}

export function defineMiddleware(key, value) {
  if (process.contextIsolated) {
    try {
      contextBridge.exposeInMainWorld(key, value)
    }
    catch (error) {
      console.error(error)
    }
  }
  else {
    window[key] = value
  }
}
