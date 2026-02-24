import { contextBridge, webUtils } from 'electron'
import '$electron/helpers/debugger/renderer.js'

import { electronAPI } from '@electron-toolkit/preload'
import { ipcxRenderer } from '@escrcpy/electron-ipcx/renderer'

import * as configs from '$electron/configs/index.js'

import useLoading from './loading/index.js'
import path from 'node:path'
import payload from './payload/index.js'
import store from '$electron/helpers/store/index.js'
import i18n from '$electron/helpers/i18n/index.js'
import adb from './adb/index.js'
import gnirehtet from './gnirehtet/index.js'
import scrcpy from './scrcpy/index.js'
import search from './search/index.js'
import desktop from './desktop/index.js'
import win from './window/index.js'
import terminal from './terminal/index.js'

export function createMiddleware() {
  adb.init()

  useLoading()

  defineMiddleware('$preload', {
    path,
    payload,
    store,
    i18n,
    adb,
    scrcpy,
    gnirehtet,
    search,
    desktop,
    terminal,
    win,
    configs,
    getPathForFile: file => webUtils.getPathForFile(file),
    ...electronAPI,
    ipcxRenderer,
  })
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
