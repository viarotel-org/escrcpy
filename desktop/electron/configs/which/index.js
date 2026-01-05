import { whichResolve } from '$electron/helpers/process/resources.js'
import store from '$electron/helpers/store.js'

export function getScrcpyPath(val) {
  return val ?? store.get('common.scrcpyPath') ?? getDefaultScrcpyPath()
}

export function getAdbPath(val) {
  return val ?? store.get('common.adbPath') ?? getDefaultAdbPath()
}

export function getGnirehtetPath(val) {
  return val ?? store.get('common.gnirehtetPath') ?? getDefaultGnirehtetPath()
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
