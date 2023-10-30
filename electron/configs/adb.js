import { extraResolve } from '@electron/helpers/index.js'

export const getAdbPath = () => {
  switch (process.platform) {
    case 'win32':
      return extraResolve('win/platform-tools/adb.exe')
    case 'darwin':
      return extraResolve('mac/platform-tools/adb')
    case 'linux':
      return extraResolve('linux/platform-tools/adb')
  }
}

export const adbPath = getAdbPath()
