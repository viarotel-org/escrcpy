import { exec as _exec, spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import util from 'node:util'
import { adbPath } from '$electron/configs/index.js'
import appStore from '$electron/helpers/store.js'
import { formatFileSize } from '$renderer/utils/index'
import { Adb } from '@devicefarmer/adbkit'
import dayjs from 'dayjs'
import { streamToBase64 } from '$electron/helpers/index.js'
import { parseBatteryDump } from './helpers/battery/index.js'
import { ipv6Wrapper, isIpv6 } from './helpers/index.js'
import adbScanner from './helpers/scanner/index.js'
import { ADBUploader } from './helpers/uploader/index.js'

const exec = util.promisify(_exec)

let client = null

window.addEventListener('beforeunload', () => {
  if (client) {
    client.kill()
  }
})

appStore.onDidChange('common.adbPath', async (value, oldValue) => {
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

  client = Adb.createClient({ bin: value || adbPath })
})

const shell = async (command) => {
  const execPath = appStore.get('common.adbPath') || adbPath
  return exec(`"${execPath}" ${command}`, {
    env: { ...process.env },
    shell: true,
  })
}

const spawnShell = async (command, { stdout, stderr } = {}) => {
  const spawnPath = appStore.get('common.adbPath') || adbPath
  const args = command.split(' ')

  const spawnProcess = spawn(`"${spawnPath}"`, args, {
    env: { ...process.env },
    shell: true,
    encoding: 'utf8',
  })

  spawnProcess.stdout.on('data', (data) => {
    const stringData = data.toString()

    if (stdout) {
      stdout(stringData, spawnProcess)
    }
  })

  const stderrList = []
  spawnProcess.stderr.on('data', (data) => {
    const stringData = data.toString()

    stderrList.push(stringData)

    console.error('spawnProcess.stderr.data:', stringData)

    if (stderr) {
      stderr(stringData, spawnProcess)
    }
  })

  return new Promise((resolve, reject) => {
    spawnProcess.on('close', (code) => {
      if (code === 0) {
        resolve()
      }
      else {
        reject(
          new Error(stderrList.join(',') || `Command failed with code ${code}`),
        )
      }
    })

    spawnProcess.on('error', (err) => {
      reject(err)
    })
  })
}

const getDevices = async () => client.listDevicesWithPaths()

const deviceShell = async (id, command) => {
  const res = await client.getDevice(id).shell(command).then(Adb.util.readAll)
  return res.toString()
}

const kill = async (...params) => client.kill(...params)

const getDeviceIP = async (id) => {
  try {
    const { stdout } = await shell(`-s ${id} shell ip -f inet addr show wlan0`)
    const reg = /inet ([0-9.]+)\/\d+/
    const match = stdout.match(reg)
    const value = match[1]

    return value
  }
  catch (error) {
    console.warn('adb.getDeviceIP.error', error.message)
  }
}

const tcpip = async (id, port = 5555) => client.getDevice(id).tcpip(port)

const screencap = async (deviceId, options = {}) => {
  const { returnBase64 = false } = options

  const device = client.getDevice(deviceId)

  const fileStream = await device.screencap()

  if (!fileStream) {
    throw new Error('Failed to obtain screenshot data')
  }

  if (returnBase64) {
    const base64 = await streamToBase64(fileStream)
    return base64
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

const isInstalled = async (id, pkg) => client.getDevice(id).isInstalled(pkg)

const version = async () => client.version()

const watch = async (callback) => {
  const tracker = await client.trackDevices()
  tracker.on('add', async (ret) => {
    callback('add', ret)
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

async function readdir(id, filePath) {
  const value = await client.getDevice(id).readdir(filePath)

  return value.map(item => ({
    ...item,
    id: [filePath, item.name].join('/'),
    type: item.isFile() ? 'file' : 'directory',
    name: item.name,
    size: formatFileSize(item.size),
    updateTime: dayjs(item.mtime).format('YYYY-MM-DD HH:mm:ss'),
  }))
}

async function push(id, filePath, args = {}) {
  const { progress, savePath = '/sdcard/Download' } = args

  const fileName = path.basename(filePath)

  const fullSavePath = `${savePath}/${fileName}`.replace(/\/+/g, '/')

  const transfer = await client.getDevice(id).push(filePath, fullSavePath)

  return new Promise((resolve, reject) => {
    transfer.on('progress', (stats) => {
      progress?.(stats)
    })

    transfer.on('end', () => {
      resolve(fullSavePath)
    })

    transfer.on('error', (err) => {
      reject(err)
    })
  })
}

async function pull(id, filePath, args = {}) {
  const { progress, savePath = '../' } = args

  const fileName = path.basename(filePath)

  const fullSavePath = path.resolve(savePath, fileName)

  const transfer = await client.getDevice(id).pull(filePath)

  return new Promise((resolve, reject) => {
    transfer.on('progress', (stats) => {
      progress?.(stats)
    })

    transfer.on('end', () => {
      resolve(fullSavePath)
    })

    transfer.on('error', (err) => {
      reject(err)
    })

    transfer.pipe(fs.createWriteStream(fullSavePath))
  })
}

async function scannerConnect(password, options = {}) {
  return adbScanner.connect({
    password,
    adb: {
      pair,
      connect,
      shell,
    },
    ...options,
  })
}

async function battery(id) {
  const res = await deviceShell(id, 'dumpsys battery')

  const value = parseBatteryDump(res)

  return value
}

async function pair(host, port, code) {
  const { stderr, stdout } = await shell(`pair ${ipv6Wrapper(host)}:${port} ${code}`)

  if (stderr) {
    throw stderr
  }

  return stdout
}

async function connect(host, port = 5555) {
  if (!isIpv6(host) && client) {
    return client.connect(host, port)
  }

  const { stderr, stdout } = await shell(`connect ${ipv6Wrapper(host)}:${port}`)

  if (stderr) {
    throw stderr
  }

  const errorKeys = ['cannot', 'failed']

  if (errorKeys.some(item => stdout.includes(item))) {
    throw stdout
  }

  return stdout
}

async function disconnect(host, port = 5555) {
  if (!isIpv6(host) && client) {
    return client.disconnect(host, port)
  }

  const { stderr, stdout } = await shell(`disconnect ${ipv6Wrapper(host)}:${port}`)

  if (stderr) {
    throw stderr
  }

  return stdout
}

function uploader(options = {}) {
  const { deviceId, localPaths, remotePath = '/sdcard/Download', ...initialOptions } = options

  const uploader = new ADBUploader({
    adb: client,
    onError: (error, file) => {
      console.error(`Error uploading ${file}:`, error)
    },
    ...initialOptions,
  })

  return {
    context: uploader,
    start: () => uploader.uploadTo(
      remotePath,
      localPaths,
      deviceId,
    ),
    cancel: () => uploader.cancel(),
  }
}

function init() {
  const bin = appStore.get('common.adbPath') || adbPath

  client = Adb.createClient({
    bin,
  })
}

export default {
  init,
  shell,
  spawnShell,
  getDevices,
  deviceShell,
  kill,
  pair,
  connect,
  disconnect,
  getDeviceIP,
  tcpip,
  screencap,
  install,
  isInstalled,
  version,
  push,
  pull,
  watch,
  readdir,
  scannerConnect,
  battery,
  uploader,
}
