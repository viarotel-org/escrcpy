import { resolve } from 'node:path'
import { contextBridge } from 'electron'

export const isPackaged = process.env.IS_PACKAGED === 'true'

export const extraResolve = (value) => {
  return isPackaged
    ? resolve(process.resourcesPath, `extra/${value}`)
    : resolve(`electron/resources/extra/${value}`)
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
