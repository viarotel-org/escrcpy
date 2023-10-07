import { Adb } from '@devicefarmer/adbkit'
import adbPath from '@resources/core/adb.exe?asset&asarUnpack'

const util = require('node:util')
const exec = util.promisify(require('node:child_process').exec)

let client = null

window.addEventListener('beforeunload', () => {
  if (client) {
    client.kill()
  }
})

const getDevices = async () => await client.listDevicesWithPaths()
const shell = async (id, command) => await client.getDevice(id).shell(command)
const rawShell = async command => exec(`${adbPath} ${command}`)
const kill = async (...params) => await client.kill(...params)
const connect = async (...params) => await client.connect(...params)
const disconnect = async (...params) => await client.disconnect(...params)

const watch = async (callback) => {
  const tracker = await client.trackDevices()
  tracker.on('add', (device) => {
    callback('add', device)
  })

  tracker.on('remove', (device) => {
    callback('remove', device)
  })

  tracker.on('end', (ret) => {
    callback('end', ret)
  })

  tracker.on('error', (err) => {
    callback('error', err)
  })

  const close = () => tracker.end()

  return close
}

export default () => {
  client = Adb.createClient({ bin: adbPath })
  console.log('client', client)

  return {
    getDevices,
    shell,
    rawShell,
    kill,
    connect,
    disconnect,
    watch,
  }
}
