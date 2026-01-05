import { camelCase, cloneDeep, keyBy } from 'lodash-es'

/**
 * @desc 使用async await 进行延时操作
 * @param {number} time - 延时时间（毫秒）
 * @returns {Promise<boolean>} 延时完成后返回true
 */
export function sleep(time = 500) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), time)
  })
}

/**
 * 检查字符串是否为带端口的IP地址格式
 * @param {string} ip - 要检查的IP地址字符串
 * @returns {boolean} 是否为有效的IP:PORT格式
 */
export function isIPWithPort(ip) {
  const regex
    = /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d):(1\d{0,4}|[1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/

  return regex.test(ip)
}

/**
 * 创建一个代理对象，将目标对象的指定方法转发并执行。
 *
 * @param {object} targetObject - 目标对象，包含要代理的方法。
 * @param {string[]} methodNames - 要代理的方法名称数组。
 * @returns {object} - 代理对象，包含转发的方法。
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
 * 对列表中的每个项目执行给定的迭代器函数，并返回一个 Promise，
 * 该 Promise 在所有迭代完成时解决，无论它们是成功还是失败。
 *
 * @param {Array} list - 要迭代的项目数组。
 * @param {Function} iterator - 对列表中每个项目执行的函数。
 *   它应该返回一个 Promise 或者可以是一个异步函数。
 * @param {*} iterator.item - 当前正在处理的列表项。
 * @param {number} iterator.index - 当前正在处理的项目的索引。
 * @param {Array} iterator.array - 正在处理的原始数组。
 * @returns {Promise<Array<PromiseSettledResult>>} 一个 Promise，解析为一个对象数组，
 *   描述输入数组中每个 promise 的结果。
 * @throws {TypeError} 如果第一个参数不是数组或第二个参数不是函数。
 *
 * @example
 * const list = [1, 2, 3, 4, 5];
 * const iterator = async (item) => {
 *   if (item % 2 === 0) {
 *     return item * 2;
 *   } else {
 *     throw new Error('奇数');
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
 * @description 继承组件方法
 * @param {*} refName ref名称
 * @param {*} methodNames 需要继承的方法名列表
 * @returns
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
 * 通用定时器
 * @param {string} type
 */
export function setTimer(type, ...args) {
  const method = camelCase(`set-${type}`)
  return globalThis[method](...args)
}

/**
 * 通用清除定时器
 * @param {string} type
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
