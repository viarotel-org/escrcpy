import { electronAPI } from '@electron-toolkit/preload'
import electronStore from '$electron/helpers/store/index.js'

import adb from '$electron/middleware/adb/index.js'

import { ProcessManager } from '$electron/process/manager.js'
import { sheller } from '$electron/helpers/shell/index.js'

const processManager = new ProcessManager()

electronAPI.ipcRenderer.on('quit-before', async () => {
  stop().catch((error) => {
    console.warn(error.message || 'Stop service failure')
  })
})

function normalizeGnirehtetError(error) {
  const message = error?.stderr || error?.message
  throw new Error(message)
}

async function shell(command, options = {}) {
  const gnirehtetProcess = sheller(`gnirehtet ${command}`, {
    shell: true,
    encoding: 'utf8',
    ...options,
  })

  processManager.add(gnirehtetProcess)

  const promise = gnirehtetProcess.catch(normalizeGnirehtetError)

  return Object.assign(gnirehtetProcess, {
    then: promise.then.bind(promise),
    catch: promise.catch.bind(promise),
    finally: promise.finally.bind(promise),
  })
}

function install(deviceId) {
  return shell(`install "${deviceId}"`)
}

function start(deviceId, options = {}) {
  const append = options.append ? ` ${options.append}` : ''

  return shell(`start "${deviceId}"${append}`)
}

async function stop(deviceId) {
  await processManager.kill()
  const command = deviceId ? ` "${deviceId}"` : ''
  return shell(`stop${command}`)
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

function relay() {
  return new Promise((resolve, reject) => {
    shell('relay', {
      stdout: (data) => {
        if (data.includes('Relay server started')) {
          resolve(data)
        }
      },
      stderr: (error) => {
        reject(error)
      },
    })
  })
}

async function run(deviceId) {
  await stop(deviceId).catch((error) => {
    console.warn(error.message || 'Stop service failure')
  })

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

  const append = (electronStore.get('common.gnirehtetAppend') || '').replace(/\r?\n/g, ' ').trim()

  await start(deviceId, { append }).catch((error) => {
    throw new Error(error?.message || 'Gnirehtet Start fail')
  })
}

async function killProcesses() {
  await processManager.kill()
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
