import which from 'which'
import { extraResolve } from '$electron/helpers/index.js'

export const getGnirehtetPath = () => {
  switch (process.platform) {
    // case 'darwin':
    //   return extraResolve('mac/gnirehtet/gnirehtet')
    case 'win32':
      return extraResolve('win/gnirehtet/gnirehtet.exe')
    case 'linux':
      return extraResolve('linux/gnirehtet/gnirehtet')
    default:
      return which.sync('gnirehtet', { nothrow: true })
  }
}

export const gnirehtetPath = getGnirehtetPath()

export const gnirehtetApkPath = extraResolve('common/gnirehtet/gnirehtet.apk')
