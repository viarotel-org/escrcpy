import util from 'node:util'
import { exec as _exec, spawn } from 'node:child_process'
import path from 'node:path'
import fs from 'node:fs'
import dayjs from 'dayjs'
import { Adb } from '@devicefarmer/adbkit'
import appStore from '@electron/helpers/store.js'
import { adbPath } from '@electron/configs/index.js'
import { uniq } from 'lodash-es'

const exec = util.promisify(_exec)

let client = null

window.addEventListener('beforeunload', () => {
  if (client) {
    client.kill()
  }
})

appStore.onDidChange('common.adbPath', async (value, oldValue) => {
  console.log('onDidChange.common.adbPath', value)

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
  return exec(`${execPath} ${command}`, {
    env: { ...process.env },
    shell: true,
  })
}

const spawnShell = async (command, { stdout, stderr } = {}) => {
  const spawnPath = appStore.get('common.adbPath') || adbPath
  const args = command.split(' ')

  console.log('adb.spawnShell.spawnPath', spawnPath)
  console.log('adb.spawnShell.args', args)

  const spawnProcess = spawn(`"${spawnPath}"`, args, {
    env: { ...process.env },
    shell: true,
    encoding: 'utf8',
  })

  spawnProcess.stdout.on('data', (data) => {
    const stringData = data.toString()

    console.log('spawnProcess.stdout.data:', stringData)

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

const connect = async (...params) => client.connect(...params)

const disconnect = async (...params) => client.disconnect(...params)

const getDeviceIP = async (id) => {
  try {
    const { stdout } = await shell(`-s ${id} shell ip -f inet addr show wlan0`)
    // console.log('stdout', stdout)
    const reg = /inet ([0-9.]+)\/\d+/
    const match = stdout.match(reg)
    const value = match[1]

    console.log('adbkit.getDeviceIP', value)
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

const isInstalled = async (id, pkg) => client.getDevice(id).isInstalled(pkg)

const version = async () => client.version()

const display = async (deviceId) => {
  let value = []
  try {
    const res = await deviceShell(deviceId, 'dumpsys display')

    const regex = /Display Id=(\d+)/g

    const match = res.match(regex) || []

    const mapValue = match.map(item => item.split('=')[1])

    value = uniq(mapValue)
  }
  catch (error) {
    console.warn(error?.message || error)
  }

  console.log('display.deviceId.value', value)

  return value
}

const clearOverlayDisplayDevices = async (deviceId) => {
  return deviceShell(
    deviceId,
    'settings put global overlay_display_devices none',
  )
}

const push = async (
  id,
  filePath,
  { progress, savePath = `/sdcard/Download/${path.basename(filePath)}` } = {},
) => {
  const res = await client.getDevice(id).push(filePath, savePath)

  return new Promise((resolve, reject) => {
    res.on('progress', (stats) => {
      console.log('adb.push.progress', stats)

      progress?.(stats)
    })

    res.on('end', (ret) => {
      resolve(ret)
    })

    res.on('error', (err) => {
      reject(err)
    })
  })
}

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
  const binPath = appStore.get('common.adbPath') || adbPath

  console.log('adb.binPath', binPath)

  client = Adb.createClient({
    bin: binPath,
  })

  console.log('client', client)

  return {
    shell,
    spawnShell,
    getDevices,
    deviceShell,
    kill,
    connect,
    disconnect,
    getDeviceIP,
    tcpip,
    screencap,
    install,
    isInstalled,
    version,
    display,
    clearOverlayDisplayDevices,
    push,
    watch,
  }
}
