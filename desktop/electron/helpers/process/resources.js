import { resolve } from 'node:path'
import which from 'which'

export function extraResolve(filePath) {
  const isPackaged = ['true'].includes(process.env.IS_PACKAGED)

  const basePath = isPackaged ? process.resourcesPath : 'electron/resources'

  const value = resolve(basePath, 'extra', filePath)

  return value
}

export function buildResolve(value) {
  return resolve(`electron/resources/build/${value}`)
}

export function whichResolve(command) {
  return which.sync(command, { nothrow: true, path: process.env.PATH })
}
