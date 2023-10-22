import { resolve } from 'node:path'
import which from 'which'

import { buildResolve, extraResolve } from '@electron/helpers/index.js'

export const desktopPath = process.env.DESKTOP_PATH

export const devPublishPath = resolve('dev-publish.yml')

export const logoPath = buildResolve('logo@256x256.png')
export const icoLogoPath = buildResolve('logo.ico')
export const icnsLogoPath = buildResolve('logo.icns')

export const trayPath = extraResolve('tray.png')
export const macTrayPath = extraResolve('tray-Template.png')

export const adbPath
  = process.platform === 'win32'
    ? extraResolve('core/adb.exe')
    : which.sync('adb', { nothrow: true })

export const scrcpyPath
  = process.platform === 'win32'
    ? extraResolve('core/scrcpy.exe')
    : which.sync('scrcpy', { nothrow: true })

// console.log('adbPath', adbPath)
// console.log('scrcpyPath', scrcpyPath)
