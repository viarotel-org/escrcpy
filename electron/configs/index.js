import { resolve } from 'node:path'

import { buildResolve, extraResolve } from '$electron/helpers/index.js'

export { adbPath } from './android-platform-tools/index.js'

export { scrcpyPath } from './scrcpy/index.js'

export { gnirehtetPath, gnirehtetApkPath } from './gnirehtet/index.js'

export const desktopPath = process.env.DESKTOP_PATH

export const devPublishPath = resolve('dev-publish.yml')

export const logoPath = buildResolve('logo.png')
export const icoLogoPath = buildResolve('logo.ico')
export const icnsLogoPath = buildResolve('logo.icns')

export const trayPath
  = process.platform === 'darwin'
    ? extraResolve('mac/tray/iconTemplate.png')
    : extraResolve('common/tray/icon.png')

export const logPath = process.env.LOG_PATH
