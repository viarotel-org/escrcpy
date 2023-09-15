import { electronAPI } from '@electron-toolkit/preload'
import { Adb } from '@devicefarmer/adbkit'

import scrcpyPath from '../../resources/core/scrcpy.exe?asset&asarUnpack'
import { addContext } from './helpers/index.js'

const util = require('node:util')
const exec = util.promisify(require('node:child_process').exec)

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
addContext('electron', electronAPI)
addContext('api', api)

addContext('adbkit', () => {
  const client = Adb.createClient()
  console.log('client', client)

  const getDevices = async () => await client.listDevicesWithPaths()
  const shell = async (id, command) => await client.getDevice(id).shell(command)
  const kill = async () => await client.kill()
  return {
    getDevices,
    shell,
    kill,
  }
})

addContext('scrcpy', () => {
  const shell = command => exec(`${scrcpyPath} ${command}`)

  return {
    shell,
  }
})
