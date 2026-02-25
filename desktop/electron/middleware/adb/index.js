import fs from 'node:fs'
import path from 'node:path'
import { adbKeyboardApkPath } from '$electron/configs/index.js'
import electronStore from '$electron/helpers/store/index.js'
import { Adb } from '@devicefarmer/adbkit'
import dayjs from 'dayjs'
import { ProcessManager } from '$electron/process/manager.js'
import { streamToBase64 } from '$electron/helpers/index.js'
import { sheller } from '$electron/helpers/shell/index.js'
import { parseBatteryDump } from './helpers/battery/index.js'
import { ADBDownloader } from './helpers/downloader/index.js'
import adbScanner from './helpers/scanner/index.js'
import { ADBUploader } from './helpers/uploader/index.js'
import { electronAPI } from '@electron-toolkit/preload'
import { readDirWithStat } from './helpers/explorer/index.js'
import { setupEnvPath } from '$electron/process/helper.js'

const processManager = new ProcessManager()

let client = null

electronAPI.ipcRenderer.on('quit-before', () => {
  client?.kill?.()
  processManager.kill()
})

electronStore.onDidChange('common.adbPath', async (value, oldValue) => {
  if (value === oldValue) {
    return false
  }

  if (value === client?.options?.bin) {
    return false
  }

  try {
    await client?.kill?.()
    await processManager.kill()
  }
  catch (error) {
    console.warn(error.message)
  }

  init()
})

async function shell(command) {
  const adbProcess = sheller(`adb ${command}`, {
    shell: true,
    encoding: 'utf8',
  })

  processManager.add(adbProcess)

  return adbProcess.catch((error) => {
    const message = error?.stderr || error?.message
    throw new Error(message)
  })
}

async function deviceShell(id, command) {
  const res = await client.getDevice(id).shell(command).then(Adb.util.readAll)
  return res.toString()
}

async function kill(...params) {
  return client.kill(...params)
}

async function getDeviceIP(id) {
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

async function tcpip(id, port = 5555) {
  return client.getDevice(id).tcpip(port)
}

async function screencap(deviceId, options = {}) {
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

async function install(id, path) {
  return client.getDevice(id).install(path)
}

async function isInstalled(id, pkg) {
  return client.getDevice(id).isInstalled(pkg)
}

async function version() {
  return client.version()
}

async function watch(callback) {
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

async function readdir(id, currentPath) {
  const device = await client.getDevice(id)

  const value = await readDirWithStat(device, currentPath)

  return value
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
  const address = port ? `${host}:${port}` : host

  const { stderr, stdout } = await shell(`pair ${address} ${code}`)

  if (stderr) {
    throw stderr
  }

  return stdout
}

async function connect(host, port) {
  const address = port ? `${host}:${port}` : host

  const { stderr, stdout } = await shell(`connect ${address}`)

  if (stderr) {
    throw stderr
  }

  const errorKeys = ['cannot', 'failed']

  if (errorKeys.some(item => stdout.includes(item))) {
    throw stdout
  }

  return stdout
}

async function disconnect(host, port) {
  const address = port ? `${host}:${port}` : host

  const { stderr, stdout } = await shell(`disconnect ${address}`)

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

function downloader(options = {}) {
  const { deviceId, items, localPath, ...initialOptions } = options

  const downloaderInstance = new ADBDownloader({
    adb: client,
    onError: (error, file) => {
      console.error(`Error downloading ${file}:`, error)
    },
    ...initialOptions,
  })

  return {
    context: downloaderInstance,
    start: () => downloaderInstance.downloadTo(deviceId, items, localPath),
    preview: () => downloaderInstance.previewTasks(deviceId, items),
    cancel: () => downloaderInstance.cancel(),
  }
}

async function waitForDevice(id) {
  const device = client.getDevice(id)

  return device.waitForDevice()
}

async function getSerialNo(id) {
  let value = id

  try {
    const ret = await deviceShell(id, 'getprop ro.serialno')
    value = ret.replace(/[\n\r]/g, '')
  }
  catch (error) {
    console.error('getSerialNo.error', error?.message || error)
  }

  return value
}

async function getDeviceList() {
  const listDevicesWithPaths = await client.listDevicesWithPaths()
  const devices = listDevicesWithPaths.filter(item => !['offline'].includes(item.type))

  const value = []

  for (let index = 0; index < devices.length; index++) {
    const item = devices[index]
    const serialNo = await getSerialNo(item.id)
    value.push({
      ...item,
      serialNo,
    })
  }

  return value
}

function init() {
  // Setup the PATH environment variable by injecting necessary tool paths
  setupEnvPath()
  client = Adb.createClient()
}

async function killProcesses() {
  return processManager.kill()
}

export async function isInstalledAdbKeyboard(deviceId) {
  try {
    const pkg = 'com.android.adbkeyboard'
    const installed = await isInstalled(deviceId, pkg)
    return installed
  }
  catch (error) {
    console.warn(
      `Failed to check AdbKeyboard on device ${deviceId}:`,
      error?.message || error,
    )
    return false
  }
}

export async function installAdbKeyboard(deviceId) {
  try {
    const installed = await isInstalledAdbKeyboard(deviceId)

    if (installed) {
      return true
    }

    await install(deviceId, adbKeyboardApkPath)

    const installedAfter = await isInstalledAdbKeyboard(deviceId)

    if (installedAfter) {
      await deviceShell(deviceId, 'ime enable com.android.adbkeyboard/.AdbIME')
    }

    return installedAfter
  }
  catch (error) {
    const message = `Failed to install AdbKeyboard on device ${deviceId}: ${error?.message || error}`

    console.warn(message)

    throw new Error(message)
  }
}

export default {
  shell,
  init,
  getDeviceList,
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
  downloader,
  waitForDevice,
  getSerialNo,
  killProcesses,
  installAdbKeyboard,
  isInstalledAdbKeyboard,
}
