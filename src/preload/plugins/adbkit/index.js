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

const shell = async command => exec(`${adbPath} ${command}`)
const getDevices = async () => await client.listDevicesWithPaths()
const deviceShell = async (id, command) => await client.getDevice(id).shell(command)
const kill = async (...params) => await client.kill(...params)
const connect = async (...params) => await client.connect(...params)
const disconnect = async (...params) => await client.disconnect(...params)

const getDeviceIP = async (id) => {
  try {
    const { stdout } = await shell(`-s ${id} shell ip -f inet addr show wlan0`)
    // console.log('stdout', stdout)
    const reg = /inet ([0-9.]+)\/\d+/
    const match = stdout.match(reg)
    const value = match[1]
    return value
  }
  catch (error) {
    return false
  }
}

const tcpip = async (id, port = 5555) => await client.getDevice(id).tcpip(port)

const watch = async (callback) => {
  const tracker = await client.trackDevices()
  tracker.on('add', async (ret) => {
    const host = await getDeviceIP(ret.id)
    callback('add', { ...ret, $host: host })
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
    shell,
    getDevices,
    deviceShell,
    kill,
    connect,
    disconnect,
    watch,
    getDeviceIP,
    tcpip,
  }
}
