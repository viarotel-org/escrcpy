import { extraResolve } from '$electron/helpers/index.js'
import which from 'which'

export const getScrcpyPath = () => {
  if (['win32'].includes(process.platform)) {
    return extraResolve('win/scrcpy/scrcpy.exe')
  }
  else if (['darwin'].includes(process.platform)) {
    if (['arm64'].includes(process.arch)) {
      return extraResolve(`mac/scrcpy/scrcpy`)
    }
  }
  else if (['linux'].includes(process.platform)) {
    return extraResolve('linux/scrcpy/scrcpy')
  }

  return which.sync('scrcpy', { nothrow: true })
}

export const scrcpyPath = getScrcpyPath()
