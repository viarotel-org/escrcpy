import adbPath from '@resources/core/adb.exe?asset&asarUnpack'
import scrcpyPath from '@resources/core/scrcpy.exe?asset&asarUnpack'

const util = require('node:util')
const exec = util.promisify(require('node:child_process').exec)

const shell = command =>
  exec(`${scrcpyPath} ${command}`, { env: { ...process.env, ADB: adbPath } })

export default () => ({
  shell,
})
