import util from 'node:util'
import child_process from 'node:child_process'
import { adbPath, scrcpyPath } from '@electron/configs/index.js'

const exec = util.promisify(child_process.exec)

const shell = command =>
  exec(`${scrcpyPath} ${command}`, { env: { ...process.env, ADB: adbPath } })

export default () => ({
  shell,
})
