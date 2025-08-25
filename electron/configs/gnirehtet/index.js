import { extraResolve } from '$electron/helpers/index.js'
import which from 'which'

export const getGnirehtetPath = () => {
  const whichPath = which.sync('gnirehtet', { nothrow: true }) || void 0

  switch (process.platform) {
    // case 'darwin':
    //   return extraResolve('mac/gnirehtet/gnirehtet')

    case 'win32':
      return extraResolve('win/gnirehtet/gnirehtet.exe')

    case 'linux':
      if (['arm64'].includes(process.arch)) {
        return whichPath
      }

      return extraResolve('linux/gnirehtet/gnirehtet')

    default:
      return whichPath
  }
}

export const gnirehtetPath = getGnirehtetPath()

export const gnirehtetApkPath = extraResolve('common/gnirehtet/gnirehtet.apk')
