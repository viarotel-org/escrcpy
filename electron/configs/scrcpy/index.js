import which from 'which'
import { extraResolve } from '$electron/helpers/index.js'

export const getScrcpyPath = () => {
  switch (process.platform) {
    case 'win32':
      return extraResolve('win/scrcpy/scrcpy.exe')
    // case 'darwin':
    //   return extraResolve('mac/scrcpy/scrcpy')
    // case 'linux':
    //   return extraResolve('linux/scrcpy/scrcpy')
    default:
      return which.sync('scrcpy', { nothrow: true })
  }
}

export const scrcpyPath = getScrcpyPath()
