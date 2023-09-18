import { Adb } from '@devicefarmer/adbkit'
import adbPath from '@resources/core/adb.exe?asset&asarUnpack'

let client = null

window.addEventListener('beforeunload', () => {
  if (client) {
    client.kill()
  }
})

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

export default () => {
  client = Adb.createClient({ bin: adbPath })
  console.log('client', client)

  return {
    getDevices,
    shell,
    kill,
    connect,
    disconnect,
    watch,
  }
}
