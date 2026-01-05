import { extraResolve } from '$electron/helpers/process/resources.js'

export function getTrayPath() {
  switch (process.platform) {
    case 'win32':
      return extraResolve('win/tray/icon.png')
    case 'darwin':
      return extraResolve('mac/tray/iconTemplate.png')
    case 'linux':
      return extraResolve('linux/tray/icon.png')
    default:
      return ''
  }
}

export const trayPath = getTrayPath()

export const gnirehtetApkPath = extraResolve('common/gnirehtet/gnirehtet.apk')

export const adbKeyboardApkPath = extraResolve('common/adb-keyboard/ADBKeyboard.apk')
