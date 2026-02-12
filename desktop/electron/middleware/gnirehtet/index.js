import { electronAPI } from '@electron-toolkit/preload'
import electronStore from '$electron/helpers/store/index.js'

import adb from '$electron/middleware/adb/index.js'

import { ProcessManager } from '$electron/process/manager.js'
import { sheller } from '$electron/helpers/shell/index.js'

const appDebug = electronStore.get('common.debug') || false

const processManager = new ProcessManager()

electronAPI.ipcRenderer.on('quit-before', async () => {
  processManager.kill()
})

async function shell(command, options = {}) {
  const gnirehtetProcess = sheller(`gnirehtet ${command}`, {
    shell: true,
    encoding: 'utf8',
    ...options,
  })

  processManager.add(gnirehtetProcess)

  return gnirehtetProcess.catch((error) => {
    const message = error?.stderr || error?.message
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
