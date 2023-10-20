import util from 'node:util'
import child_process from 'node:child_process'
import path from 'node:path'
import fs from 'node:fs'
import dayjs from 'dayjs'
import { Adb } from '@devicefarmer/adbkit'
import _which from 'which'
import appStore from '@electron/helpers/store.js'
import { adbPath } from '@electron/configs/index.js'

const exec = util.promisify(child_process.exec)

let client = null

window.addEventListener('beforeunload', () => {
  if (client) {
    client.kill()
  }
})

appStore.onDidChange('scrcpy.global.adbPath', async (value, oldValue) => {
  console.log('onDidChange.scrcpy.global.adbPath', value)

  if (!value) {
    return false
  }

  if (value === oldValue) {
    return false
  }

  if (value === client?.options?.bin) {
    return false
  }

  if (client) {
    await client.kill().catch(e => console.warn(e))
    client = null
  }

  client = Adb.createClient({ bin: value })
})

const shell = async command => exec(`${adbPath} ${command}`)
const getDevices = async () => client.listDevicesWithPaths()
const deviceShell = async (id, command) => client.getDevice(id).shell(command)
const kill = async (...params) => client.kill(...params)
const connect = async (...params) => client.connect(...params)
const disconnect = async (...params) => client.disconnect(...params)

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

const tcpip = async (id, port = 5555) => client.getDevice(id).tcpip(port)

const screencap = async (deviceId, options = {}) => {
  let fileStream = null
  try {
    const device = client.getDevice(deviceId)
    fileStream = await device.screencap()
    console.log('fileStream', fileStream)
  }
  catch (error) {
    console.warn(error?.message || error)
    return false
  }

  if (!fileStream) {
    return false
  }

  const fileName = `Screencap-${dayjs().format('YYYY-MM-DD-HH-mm-ss')}.png`
  const savePath = options.savePath || path.resolve('../', fileName)

  return new Promise((resolve, reject) => {
    fileStream
      .pipe(fs.createWriteStream(savePath))
      .on('finish', () => {
        resolve(true)
      })
      .on('error', (error) => {
        console.warn(error?.message || error)
        reject(false)
      })
  })
}

const install = async (id, path) => client.getDevice(id).install(path)

const version = async () => client.version()

const which = async () => _which('adb')

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
  const binPath = appStore.get('scrcpy.global.adbPath') || adbPath

  client = Adb.createClient({
    bin: binPath,
  })

  console.log('client', client)

  return {
    shell,
    getDevices,
    deviceShell,
    kill,
    connect,
    disconnect,
    getDeviceIP,
    tcpip,
    screencap,
    install,
    version,
    which,
    watch,
  }
}
