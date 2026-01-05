import { join } from 'node:path'
import { Buffer } from 'node:buffer'
import { nativeTheme } from 'electron'
import { cloneDeep, isEmpty, omitBy } from 'lodash-es'

/**
 * 安全的深拷贝函数，避免循环引用导致的栈溢出
 * @param {any} value - 要拷贝的值
 * @returns {any} - 拷贝后的值
 */
function safeCloneDeep(value) {
  // 对于原始类型、null、undefined 直接返回
  if (value === null || typeof value !== 'object') {
    return value
  }

  // 对于错误对象，只保留基本信息避免循环引用
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    }
  }

  // 对于其他对象类型，尝试深拷贝，失败则返回原值
  try {
    return cloneDeep(value)
  }
  catch (error) {
    // 如果深拷贝失败（通常是循环引用），返回简化版本
    if (error instanceof RangeError) {
      return Array.isArray(value) ? [...value] : { ...value }
    }
    return value
  }
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
    proxyObj[methodName] = (...args) =>
      targetObject[methodName](...args.map(arg => safeCloneDeep(arg)))

    return proxyObj
  }, {})
}

export async function executeI18n(mainWindow, value) {
  try {
    return await mainWindow.webContents.executeJavaScript(
      `window.t('${value}')`,
    )
  }
  catch (error) {
    console.warn(error?.message || error)
    return value
  }
}

export function isWindowDestroyed(win) {
  return !win || win?.isDestroyed?.()
}

export function loadPage(win, prefix = '', query) {
  // 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
  const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

  let stringifyQuery = ''

  if (query) {
    stringifyQuery = typeof query === 'string' ? query : `?${(new URLSearchParams(omitBy(query || {}, isEmpty))).toString()}`
  }

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(join(VITE_DEV_SERVER_URL, prefix) + stringifyQuery)
  }
  else {
    win.loadFile(join(process.env.DIST, prefix, 'index.html'), {
      search: stringifyQuery,
    })
  }
}

export function streamToBase64(stream) {
  return new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', (chunk) => {
      chunks.push(chunk)
    })
    stream.on('end', () => {
      const buffer = Buffer.concat(chunks)
      resolve(buffer.toString('base64'))
    })
    stream.on('error', (error) => {
      reject(error)
    })
  })
}

export function autoUpdateTitleBarOverlay(win) {
  if (['win32'].includes(process.platform)) {
    win.setTitleBarOverlay({
      color: nativeTheme.shouldUseDarkColors ? '#0A0A0A' : '#F5F5F5',
      symbolColor: nativeTheme.shouldUseDarkColors ? '#CFD3DC' : '#606266',
      height: 32,
    })
  }
}
