import { resolve } from 'node:path'

import { buildResolve, extraResolve } from '@electron/helpers/index.js'

export const devPublishPath = resolve('dev-publish.yml')

export const logoPath = buildResolve('logo.png')
export const icoLogoPath = buildResolve('logo.ico')
export const icnsLogoPath = buildResolve('logo.icns')

export const adbPath = extraResolve('core/adb.exe')

export const scrcpyPath = extraResolve('core/scrcpy.exe')
