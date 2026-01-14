import { whichResolve } from '$electron/helpers/process/resources.js'
import electronStore from '$electron/helpers/store/index.js'

export function getScrcpyPath({ store = electronStore } = {}) {
  return store.get('common.scrcpyPath') ?? getDefaultScrcpyPath()
}

export function getAdbPath({ store = electronStore } = {}) {
  return store.get('common.adbPath') ?? getDefaultAdbPath()
}

export function getGnirehtetPath({ store = electronStore } = {}) {
  return store.get('common.gnirehtetPath') ?? getDefaultGnirehtetPath()
}

export function getDefaultScrcpyPath() {
  return whichResolve('scrcpy')
}

export function getDefaultAdbPath() {
  return whichResolve('adb')
}

export function getDefaultGnirehtetPath() {
  return whichResolve('gnirehtet')
}
