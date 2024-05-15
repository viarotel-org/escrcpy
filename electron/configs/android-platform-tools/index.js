import { extraResolve } from '$electron/helpers/index.js'

export const getAdbPath = () => {
  switch (process.platform) {
    case 'win32':
      return extraResolve('win/android-platform-tools/adb.exe')
    case 'darwin':
      return extraResolve('mac/android-platform-tools/adb')
    case 'linux':
      return extraResolve('linux/android-platform-tools/adb')
  }
}

export const adbPath = getAdbPath()
