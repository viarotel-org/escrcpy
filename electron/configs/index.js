import { resolve } from 'node:path'

import { buildResolve, extraResolve } from '@electron/helpers/index.js'

export const desktopPath = process.env.DESKTOP_PATH

export const devPublishPath = resolve('dev-publish.yml')

export const logoPath = buildResolve('logo.png')
export const icoLogoPath = buildResolve('logo.ico')
export const icnsLogoPath = buildResolve('logo.icns')

export const adbPath
  = process.platform === 'win32' ? extraResolve('core/adb.exe') : 'adb'

export const scrcpyPath
  = process.platform === 'win32' ? extraResolve('core/scrcpy.exe') : 'scrcpy'
