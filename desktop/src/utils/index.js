import { camelCase, cloneDeep, keyBy } from 'lodash-es'

/**
 * Delay execution using async/await
 * @param {number} time - Delay time in milliseconds
 * @returns {Promise<boolean>} Resolves to true after the delay
 */
export function sleep(time = 500) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), time)
  })
}

/**
 * Check whether a string is an IP:PORT format
 * @param {string} ip - The IP address string to check
 * @returns {boolean} True if a valid IP:PORT format
 */
export function isIPWithPort(ip) {
  const regex
    = /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d):(1\d{0,4}|[1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/

  return regex.test(ip)
}

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
 * Execute the provided iterator function for each item in a list and return a Promise
 * that resolves when all iterations complete, regardless of success or failure.
 *
 * @param {Array} list - Array of items to iterate.
 * @param {Function} iterator - Function applied to each item in the list.
 *   It should return a Promise or be an async function.
 * @param {*} iterator.item - The current list item being processed.
 * @param {number} iterator.index - The index of the current item.
 * @param {Array} iterator.array - The original array being processed.
 * @returns {Promise<Array<PromiseSettledResult>>} A Promise that resolves to an array of results
 *   describing each input promise's outcome.
 * @throws {TypeError} If the first argument is not an array or the second argument is not a function.
 *
 * @example
 * const list = [1, 2, 3, 4, 5];
 * const iterator = async (item) => {
 *   if (item % 2 === 0) {
 *     return item * 2;
 *   } else {
 *     throw new Error('Odd number');
 *   }
 * };
 * allSettledWrapper(list, iterator).then(console.log);
 */
export function allSettledWrapper(list = [], iterator) {
  const promises = []

  for (let index = 0; index < list.length; index++) {
    const item = list[index]

    promises.push(iterator(item, index))
  }

  return Promise.allSettled(promises)
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
 * 判断当前运行平台
 * @param {*} name 平台名称
 * @returns {boolean} 是否是指定平台
 */
export function isPlatform(name) {
  const model = {
    macos: 'darwin',
    windows: 'win32',
    linux: 'linux',
    freebsd: 'freebsd',
    openbsd: 'openbsd',
    android: 'android',
    ios: 'ios',
  }

  const currentPlatform = model[name] || name

  return currentPlatform === window.electron.process.platform
}
