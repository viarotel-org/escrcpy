import { cloneDeep, keyBy } from 'lodash-es'

/**
 * @desc 使用async await 进项进行延时操作
 * @param {*} time
 */
export function sleep(time = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), time)
  })
}

export function isIPWithPort(ip) {
  const regex
    = /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d):(1\d{0,4}|[1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/

  return regex.test(ip)
}

export function replaceIP(value) {
  return value.replaceAll('.', '_').replaceAll(':', '-')
}

export function restoreIP(value) {
  return value.replaceAll('_', '.').replaceAll('-', ':')
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
