import { extraResolve } from '$electron/helpers/index.js'

export const getAdbPath = () => {
  switch (process.platform) {
    case 'win32':
      return extraResolve(`win-${process.arch}/scrcpy/adb.exe`)

    case 'darwin':
      return extraResolve(`mac-${process.arch}/scrcpy/adb`)

    case 'linux':
      return extraResolve(`linux-${process.arch}/scrcpy/adb`)
  }
}

export const adbPath = getAdbPath()
