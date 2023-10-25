import { resolve } from 'node:path'
import which from 'which'

import { buildResolve, extraResolve } from '@electron/helpers/index.js'

export const desktopPath = process.env.DESKTOP_PATH

export const devPublishPath = resolve('dev-publish.yml')

export const logoPath = buildResolve('logo.png')
export const icoLogoPath = buildResolve('logo.ico')
export const icnsLogoPath = buildResolve('logo.icns')

export const trayPath
  = process.platform === 'darwin'
    ? extraResolve('trayTemplate.png')
    : extraResolve('tray.png')

export const adbPath
  = process.platform === 'win32'
    ? extraResolve('core/adb.exe')
    : which.sync('adb', { nothrow: true })

export const scrcpyPath
  = process.platform === 'win32'
    ? extraResolve('core/scrcpy.exe')
    : which.sync('scrcpy', { nothrow: true })

export const logPath = process.env.LOG_PATH

// console.log('adbPath', adbPath)
// console.log('scrcpyPath', scrcpyPath)
