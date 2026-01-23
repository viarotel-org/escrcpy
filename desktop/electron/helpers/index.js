import { join } from 'node:path'
import { Buffer } from 'node:buffer'
import { nativeTheme } from 'electron'
import { cloneDeep, isEmpty, omitBy } from 'lodash-es'

/**
 * Safe deep clone function to avoid stack overflow from circular references
 * @param {any} value - Value to clone
 * @returns {any} - Cloned value
 */
function safeCloneDeep(value) {
  // Return early for primitive, null, or undefined
  if (value === null || typeof value !== 'object') {
    return value
  }

  // For Error objects, keep basic info to avoid circular references
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    }
  }

  // For other object types, attempt deep clone; return original value on failure
  try {
    return cloneDeep(value)
  }
  catch (error) {
    // If deep clone fails (often due to circular refs), return a shallow copy
    if (error instanceof RangeError) {
      return Array.isArray(value) ? [...value] : { ...value }
    }
    return value
  }
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

export function getAppBackgroundColor() {
  return nativeTheme.shouldUseDarkColors ? '#0A0A0A' : '#F5F5F5'
}

export function isPortable() {
  return process.platform === 'win32' && Boolean(process.env.PORTABLE_EXECUTABLE_DIR)
}

export function isPackaged() {
  return process.env.IS_PACKAGED === 'true'
}
