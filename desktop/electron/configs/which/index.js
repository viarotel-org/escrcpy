import { getExtraPlatformDirs, whichResolve } from '$electron/process/resources.js'
import electronStore from '$electron/helpers/store/index.js'

/**
 * Return the user-configured scrcpy directory from store, or undefined.
 */
export function getUserScrcpyDir({ store = electronStore } = {}) {
  return store.get('common.scrcpyDir')
}

/**
 * Return the user-configured adb directory from store, or undefined.
 */
export function getUserAdbDir({ store = electronStore } = {}) {
  return store.get('common.adbDir')
}

/**
 * Return the user-configured gnirehtet directory from store, or undefined.
 */
export function getUserGnirehtetDir({ store = electronStore } = {}) {
  return store.get('common.gnirehtetDir')
}

/**
 * Resolve the scrcpy directory: user-configured > platform built-in.
 */
export function getScrcpyDir(options) {
  return getUserScrcpyDir(options) || getExtraPlatformDirs().scrcpy
}

/**
 * Resolve the adb directory: user-configured > platform built-in.
 */
export function getAdbDir(options) {
  return getUserAdbDir(options) || getExtraPlatformDirs().adb
}

/**
 * Resolve the gnirehtet directory: user-configured > platform built-in.
 */
export function getGnirehtetDir(options) {
  return getUserGnirehtetDir(options) || getExtraPlatformDirs().gnirehtet
}

/**
 * Resolve the scrcpy executable path.
 * Searches user directory > built-in directories > system PATH.
 */
export function getScrcpy(options) {
  return whichResolve('scrcpy', getUserScrcpyDir(options))
}

/**
 * Resolve the adb executable path.
 * Searches user directory > built-in directories > system PATH.
 */
export function getAdb(options) {
  return whichResolve('adb', getUserAdbDir(options))
}

/**
 * Resolve the gnirehtet executable path.
 * Searches user directory > built-in directories > system PATH.
 */
export function getGnirehtet(options) {
  return whichResolve('gnirehtet', getUserGnirehtetDir(options))
}
