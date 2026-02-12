import { whichResolve } from '$electron/process/resources.js'
import electronStore from '$electron/helpers/store/index.js'

export function getScrcpyPath({ store = electronStore, onlyStore, onlyDefault } = {}) {
  if (onlyStore) {
    return store.get('common.scrcpyPath')
  }

  if (onlyDefault) {
    return getDefaultScrcpyPath()
  }

  return store.get('common.scrcpyPath') ?? getDefaultScrcpyPath()
}

export function getAdbPath({ store = electronStore, onlyStore, onlyDefault } = {}) {
  if (onlyStore) {
    return store.get('common.adbPath')
  }

  if (onlyDefault) {
    return getDefaultAdbPath()
  }

  return store.get('common.adbPath') ?? getDefaultAdbPath()
}

export function getGnirehtetPath({ store = electronStore, onlyStore, onlyDefault } = {}) {
  if (onlyStore) {
    return store.get('common.gnirehtetPath')
  }

  if (onlyDefault) {
    return getDefaultGnirehtetPath()
  }

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
