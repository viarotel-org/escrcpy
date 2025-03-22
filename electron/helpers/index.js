import { join, resolve } from 'node:path'
import { Buffer } from 'node:buffer'
import { contextBridge } from 'electron'
import { cloneDeep } from 'lodash-es'
import treeKill from 'tree-kill'

export const isPackaged = ['true'].includes(process.env.IS_PACKAGED)

export const extraResolve = (filePath) => {
  const basePath = isPackaged ? process.resourcesPath : 'electron/resources'

  const value = resolve(basePath, 'extra', filePath)

  return value
}

export const buildResolve = value =>
  resolve(`electron/resources/build/${value}`)

export function exposeContext(key, value) {
  if (process.contextIsolated) {
    try {
      contextBridge.exposeInMainWorld(key, value)
    }
    catch (error) {
      console.error(error)
    }
  }
  else {
    window[key] = value
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
      targetObject[methodName](...cloneDeep(args))

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

export function loadPage(win, prefix = '') {
  // 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
  const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(join(VITE_DEV_SERVER_URL, prefix))
  }
  else {
    win.loadFile(join(process.env.DIST, prefix, 'index.html'))
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

/**
 * Process Manager
 */
export class ProcessManager {
  constructor() {
    this.processList = []
  }

  add(process) {
    this.processList.push(process)
  }

  kill(process) {
    if (!process) {
      this.processList.forEach(item => treeKill(item.pid))
      this.processList = []
      return this
    }

    const pid = process?.pid || process
    treeKill(pid)
    this.processList = this.processList.filter(item => item.pid !== pid)
    return this
  }
}
