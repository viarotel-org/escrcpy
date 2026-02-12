/**
 * Populate environment variables with key runtime info in the main process,
 * making them available to the preload script and renderer processes.
 *
 * Note: app.isPackaged can be modified by other code, so this file must be
 * imported near the top of main.js before dependent modules.
 */

import { app } from 'electron'
import fixPath from 'fix-path'
import { setupPortableMode } from './portable.js'
import { setupEnvPath } from './helper.js'

setupPortableMode()

if (process.platform === 'darwin') {
  fixPath()
}

process.env.IS_PACKAGED = String(app.isPackaged)

process.env.DESKTOP_PATH = app.getPath('desktop')

process.env.CWD = process.cwd()

setupEnvPath()

const isPackaged = process.env.IS_PACKAGED === 'true'

export {
  isPackaged,
}
