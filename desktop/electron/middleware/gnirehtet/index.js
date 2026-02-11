import { electronAPI } from '@electron-toolkit/preload'

import {
  getAdbPath,
  getGnirehtetPath,
  gnirehtetApkPath,
} from '$electron/configs/index.js'
import electronStore from '$electron/helpers/store/index.js'

import adb from '$electron/middleware/adb/index.js'

import { ProcessManager } from '$electron/process/manager.js'
import { sheller } from '$electron/helpers/shell/index.js'

const appDebug = electronStore.get('common.debug') || false

const processManager = new ProcessManager()

electronAPI.ipcRenderer.on('quit-before', async () => {
  processManager.kill()
})

async function shell(command, { debug = false, stdout, stderr } = {}) {
  const spawnPath = getGnirehtetPath()
  const ADB = getAdbPath()

  if (!spawnPath) {
    throw new Error(
      'Failed to retrieve Gnirehtet dependency path. If you\'re using macOS, please ensure the dependency is installed correctly.',
    )
  }

  const GNIREHTET_APK = gnirehtetApkPath
  const stderrList = []

  const gnirehtetProcess = sheller(`"${spawnPath}" ${command}`, {
    env: { ...process.env, ADB, GNIREHTET_APK },
    shell: true,
    encoding: 'utf8',
    stdout: data => stdout?.(data, gnirehtetProcess),
    stderr: (data) => {
      stderr?.(data, gnirehtetProcess)

      if (debug) {
        console.error(`${command} stderr:`, data)
      }

      stderrList.push(data)
    },
  })

  processManager.add(gnirehtetProcess)

  return gnirehtetProcess.catch((error) => {
    const message = stderrList.join(',') || error?.stderr || error?.message || `Command failed with code ${error?.exitCode ?? 'unknown'}`
    throw new Error(message)
  })
}

function install(deviceId) {
  return shell(`install "${deviceId}"`)
}

function start(deviceId, options = {}) {
  const append = options.append ? ` ${options.append}` : ''

  return shell(`start "${deviceId}"${append}`)
}

function stop(deviceId) {
  processManager.kill()
  return shell(`stop "${deviceId}"`)
}

function tunnel(deviceId) {
  return shell(`tunnel "${deviceId}"`)
}

async function isInstalled(deviceId) {
  try {
    const res = await adb.isInstalled(deviceId, 'com.genymobile.gnirehtet')
    return res
  }
  catch (error) {
    console.warn(error?.message || error)
    return false
  }
}

async function relay(args) {
  return new Promise((resolve, reject) => {
    shell('relay', {
      ...args,
      debug: appDebug,
      stdout: (_, process) => {
        resolve(process)
      },
      stderr: (error) => {
        reject(error)
      },
    }).catch((error) => {
      reject(error)
    })
  })
}

async function run(deviceId) {
  processManager.kill()

  await relay().catch((error) => {
    throw new Error(error?.message || 'Gnirehtet Relay fail')
  })

  let installed = false

  const gnirehtetFix = electronStore.get('common.gnirehtetFix') || false

  if (!gnirehtetFix) {
    installed = await isInstalled(deviceId)
  }

  if (!installed) {
    await install(deviceId).catch((error) => {
      throw new Error(error?.message || 'Gnirehtet Install Client fail')
    })
  }

  const gnirehtetAppend = electronStore.get('common.gnirehtetAppend')

  await start(deviceId, { append: gnirehtetAppend }).catch((error) => {
    throw new Error(error?.message || 'Gnirehtet Start fail')
  })
}

function killProcesses() {
  processManager.kill()
}

export default {
  shell,
  relay,
  install,
  isInstalled,
  start,
  stop,
  tunnel,
  run,
  killProcesses,
}
