import { archResolve, extraResolve } from '$electron/helpers/index.js'
import which from 'which'

export function getScrcpyPath() {
  switch (process.platform) {
    case 'win32':
      return extraResolve(archResolve('win#{arch}/scrcpy/scrcpy.exe'))
    case 'darwin':
      return extraResolve(archResolve('mac#{arch}/scrcpy/scrcpy'))
    case 'linux':
      return extraResolve(archResolve('linux#{arch}/scrcpy/scrcpy'))

    default:
      return which.sync('scrcpy', { nothrow: true })
  }
}

export const scrcpyPath = getScrcpyPath()
