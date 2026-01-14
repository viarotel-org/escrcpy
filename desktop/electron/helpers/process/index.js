/**
 * Populate environment variables with key runtime info in the main process,
 * making them available to the preload script and renderer processes.
 *
 * Note: app.isPackaged can be modified by other code, so this file must be
 * imported near the top of main.js before dependent modules.
 */

import { app } from 'electron'
import fixPath from 'fix-path'

import { resolveEnvPath } from './helper.js'

import { extraResolve } from './resources.js'

if (process.platform === 'darwin') {
  fixPath()
}

process.env.IS_PACKAGED = String(app.isPackaged)

process.env.DESKTOP_PATH = app.getPath('desktop')

process.env.CWD = process.cwd()

process.env.PATH = resolveEnvPath({
  win: [
    extraResolve(`win-${process.arch}`),
    extraResolve('win'),
    extraResolve('win/scrcpy'),
    extraResolve('win/gnirehtet'),
  ],
  mac: [
    extraResolve(`mac-${process.arch}`),
    extraResolve(`mac-${process.arch}/scrcpy`),
  ],
  linux: [
    extraResolve(`linux-${process.arch}`),
    extraResolve(`linux-${process.arch}/scrcpy`),
    extraResolve(`linux-${process.arch}/gnirehtet`),
  ],
})

process.env.EXE_PATH = app.getPath('exe')

process.env.USER_DATA_PATH = app.getPath('userData')

const isPackaged = process.env.IS_PACKAGED === 'true'

export {
  isPackaged,
}
