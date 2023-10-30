import { spawn } from 'node:child_process'
import appStore from '@electron/helpers/store.js'
import {
  adbPath,
  gnirehtetApkPath,
  gnirehtetPath,
} from '@electron/configs/index.js'

const appDebug = appStore.get('common.debug') || false

let adbkit = null

const shell = async (command, { debug = false, stdout, stderr } = {}) => {
  const spawnPath = appStore.get('common.gnirehtet') || gnirehtetPath
  const ADB = appStore.get('common.adbPath') || adbPath

  const GNIREHTET_APK = gnirehtetApkPath

  const args = command.split(' ')

  console.log('gnirehtet.shell.spawnPath', spawnPath)
  console.log('gnirehtet.shell.adbPath', adbPath)

  const gnirehtetProcess = spawn(`"${spawnPath}"`, args, {
    env: { ...process.env, ADB, GNIREHTET_APK },
    shell: true,
    encoding: 'utf8',
  })

  gnirehtetProcess.stdout.on('data', (data) => {
    const stringData = data.toString()

    if (debug) {
      console.log('gnirehtetProcess.stdout.data:', stringData)
    }

    if (stdout) {
      stdout(stringData, gnirehtetProcess)
    }
  })

  gnirehtetProcess.stderr.on('data', (data) => {
    const stringData = data.toString()

    if (debug) {
      console.error('gnirehtetProcess.stderr.data:', stringData)
    }

    if (stderr) {
      stderr(stringData, gnirehtetProcess)
    }
  })

  return new Promise((resolve, reject) => {
    gnirehtetProcess.on('close', (code) => {
      if (code === 0) {
        resolve()
      }
      else {
        reject(new Error(`Command failed with code ${code}`))
      }
    })

    gnirehtetProcess.on('error', (err) => {
      reject(err)
    })
  })
}

let relayProcess = null
const relay = async (args) => {
  if (relayProcess) {
    return relayProcess
  }

  return new Promise((resolve, reject) => {
    shell('relay', {
      ...args,
      debug: appDebug,
      stdout: (_, process) => {
        if (!relayProcess) {
          relayProcess = process
        }
        resolve(process)
      },
    }).catch((error) => {
      reject(error)
    })
  })
}

const install = deviceId => shell(`install ${deviceId}`)
const start = deviceId => shell(`start ${deviceId}`)
const stop = deviceId => shell(`stop ${deviceId}`)
const tunnel = deviceId => shell(`tunnel ${deviceId}`)

const installed = async (deviceId) => {
  const res = await adbkit.isInstalled(deviceId, 'com.genymobile.gnirehtet')
  console.log('gnirehtet.apk.installed', res)
  return res
}

const run = async (deviceId) => {
  await relay().catch((e) => {
    throw new Error('Gnirehtet Relay fail')
  })
  console.log('run.relay.success')
  await install(deviceId).catch((e) => {
    throw new Error('Gnirehtet Install Client fail')
  })
  console.log('run.install.success')
  await start(deviceId).catch((e) => {
    throw new Error('Gnirehtet Start fail')
  })
  console.log('run.start.success')
}

window.addEventListener('beforeunload', () => {
  stop()

  if (relayProcess) {
    relayProcess.kill()
  }
})

export default (options = {}) => {
  adbkit = options.adbkit

  return {
    shell,
    relay,
    install,
    installed,
    start,
    stop,
    tunnel,
    run,
  }
}
