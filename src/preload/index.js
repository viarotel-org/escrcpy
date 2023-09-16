import { electronAPI } from '@electron-toolkit/preload'
import { Adb } from '@devicefarmer/adbkit'

import scrcpyPath from '../../resources/core/scrcpy.exe?asset&asarUnpack'
import adbPath from '../../resources/core/adb.exe?asset&asarUnpack'
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
  const client = Adb.createClient({ bin: adbPath })
  console.log('client', client)

  const getDevices = async () => await client.listDevicesWithPaths()
  const shell = async (id, command) => await client.getDevice(id).shell(command)
  const kill = async (...params) => await client.kill(...params)
  const connect = async (...params) => await client.connect(...params)
  const disconnect = async (...params) => await client.disconnect(...params)

  const watch = async (callback) => {
    const tracker = await client.trackDevices()
    tracker.on('add', (device) => {
      callback(device)
    })

    tracker.on('remove', (device) => {
      callback(device)
    })

    tracker.on('end', (ret) => {
      callback(ret)
    })

    tracker.on('error', (err) => {
      callback(err)
    })

    const close = () => tracker.end()

    return close
  }

  window.addEventListener('beforeunload', () => {
    kill()
  })

  return {
    getDevices,
    shell,
    kill,
    connect,
    disconnect,
    watch,
  }
})

addContext('scrcpy', () => {
  const shell = command =>
    exec(`${scrcpyPath} ${command}`, { env: { ...process.env, ADB: adbPath } })

  return {
    shell,
  }
})
