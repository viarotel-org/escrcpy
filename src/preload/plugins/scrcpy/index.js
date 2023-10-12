import util from 'node:util'
import child_process from 'node:child_process'
import adbPath from '@resources/core/adb.exe?asset&asarUnpack'
import scrcpyPath from '@resources/core/scrcpy.exe?asset&asarUnpack'

const exec = util.promisify(child_process.exec)

const shell = command =>
  exec(`${scrcpyPath} ${command}`, { env: { ...process.env, ADB: adbPath } })

export default () => ({
  shell,
})
