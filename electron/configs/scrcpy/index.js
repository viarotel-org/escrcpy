import { extraResolve } from '$electron/helpers/index.js'
import which from 'which'

export function getScrcpyPath() {
  const whichPath = which.sync('scrcpy', { nothrow: true }) || void 0

  switch (process.platform) {
    case 'win32':
      return extraResolve('win/scrcpy/scrcpy.exe')

    case 'darwin':
      return extraResolve(`mac-${process.arch}/scrcpy/scrcpy`)

    case 'linux':
      if (['arm64'].includes(process.arch)) {
        return whichPath
      }

      return extraResolve(`linux-${process.arch}/scrcpy/scrcpy`)

    default:
      return whichPath
  }
}

export const scrcpyPath = getScrcpyPath()
