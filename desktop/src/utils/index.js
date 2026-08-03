import { camelCase, cloneDeep, keyBy } from 'lodash-es'

export { allSettledWrapper, clonePlainValue, deepToRaw, isIPWithPort, preciseAdd, sleep, toPlainValue } from '@escrcpy/shared'

/**
 * Create a proxy object that forwards specified methods from the target object.
 *
 * @param {object} targetObject - The target object containing methods to proxy.
 * @param {string[]} methodNames - Array of method names to proxy.
 * @returns {object} - Proxy object with forwarded methods.
 */
export function createProxy(targetObject, methodNames) {
  return methodNames.reduce((proxyObj, methodName) => {
    proxyObj[methodName] = (...args) => {
      return targetObject[methodName](...cloneDeep(args))
    }

    return proxyObj
  }, {})
}

export function keyByValue(data, key = 'key', valueKey = 'value') {
  const model = keyBy(data, key) || {}

  const value = Object.entries(model).reduce((obj, [modelKey, modelValue]) => {
    obj[modelKey] = modelValue?.[valueKey]
    return obj
  }, {})

  return value
}

/**
 * @description Inherit component methods
 * @param {*} refName - Reference name of the component
 * @param {*} methodNames - Array of method names to inherit
 * @returns {object} An object mapping method names to wrapper functions
 */
export function inheritComponentMethods(refName, methodNames) {
  const methods = {}
  methodNames.forEach((name) => {
    methods[name] = function (...params) {
      return this.$refs[refName][name](...params)
    }
  })
  return methods
}

/**
 * Generic timer setter
 * @param {string} type - Timer type identifier
 */
export function setTimer(type, ...args) {
  const method = camelCase(`set-${type}`)
  return globalThis[method](...args)
}

/**
 * Generic timer clearer
 * @param {string} type - Timer type identifier
 */
export function clearTimer(type, ...args) {
  const method = camelCase(`clear-${type}`)
  return globalThis[method](...args)
}

/**
 * Check if the current platform matches any of the specified platform names.
 *
 * Supports passing multiple platforms or an array of platforms. Returns true if any match.
 *
 * @example
 * isPlatform('macos')
 * isPlatform('macos', 'linux')
 * isPlatform(['windows', 'linux'])
 *
 * @typedef {'macos'|'windows'|'linux'|'freebsd'|'openbsd'|'android'|'ios'} PlatformName
 *
 * @param {...(PlatformName|string|string[])} names Platform names, can pass multiple or an array
 * @returns {boolean} Whether the current platform matches
 */
export function isPlatform(...names) {
  const model = {
    macos: 'darwin',
    windows: 'win32',
    linux: 'linux',
    freebsd: 'freebsd',
    openbsd: 'openbsd',
    android: 'android',
    ios: 'ios',
  }

  const list = names.flat()

  const currentPlatform
    = import.meta.env.VITE_SIMULATION_PLATFORM
      ?? window.$preload.process.platform

  return list.some(name => currentPlatform === (model[name] || name))
}

export function isEditableTarget(target) {
  if (!target || typeof target !== 'object') {
    return false
  }

  if (target.isContentEditable) {
    return true
  }

  const tag = target.tagName?.toLowerCase?.() || ''

  return ['input', 'textarea', 'select'].includes(tag)
}

export function createDeferred() {
  let settled = false
  let resolve
  let reject

  const promise = new Promise((res, rej) => {
    resolve = (value) => {
      if (settled) {
        return
      }

      settled = true
      res(value)
    }

    reject = (error) => {
      if (settled) {
        return
      }

      settled = true
      rej(error)
    }
  })

  return { promise, resolve, reject }
}
