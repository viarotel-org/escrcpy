import { electronAPI } from '@electron-toolkit/preload'
import quote from 'shell-quote'
import { sheller } from '$electron/helpers/shell/index.js'
import { extraResolve } from '$electron/process/resources.js'
import commandHelper from '$renderer/utils/command/index.js'

import { ProcessManager } from '$electron/process/manager.js'

import { parseDisplayIds, parseScrcpyAppList, parseScrcpyCameras, parseScrcpyCodecList } from './helper.js'

const processManager = new ProcessManager()

electronAPI.ipcRenderer.on('quit-before', () => {
  processManager.kill()
})

function normalizeScrcpyError(error) {
  const message = error?.stderr || error?.message
  throw new Error(message)
}

function createScrcpyProcess(command, options = {}) {
  const { executable, ...processOptions } = options
  let scrcpyProcess = null
  const invocation = executable
    ? [executable, ...quote.parse(command)]
    : `scrcpy ${command}`

  scrcpyProcess = sheller(invocation, {
    shell: !executable,
    encoding: 'utf8',
    ...processOptions,
    stderr: (data) => {
      processOptions?.stderr?.(data, scrcpyProcess)
      console.error('scrcpyProcess.stderr.data:', data)
    },
  })

  processManager.add(scrcpyProcess)

  const promise = scrcpyProcess.catch(normalizeScrcpyError)

  return Object.assign(scrcpyProcess, {
    then: promise.then.bind(promise),
    catch: promise.catch.bind(promise),
    finally: promise.finally.bind(promise),
  })
}

function createMirrorProcess(
  serial,
  { title, args = '', ...options } = {},
) {
  return createScrcpyProcess(
    `--serial="${serial}" --window-title="${title}" ${args}`,
    options,
  )
}

async function shell(...args) {
  return createScrcpyProcess(...args)
}

async function getEncoders(serial) {
  const res = await createScrcpyProcess(`--serial="${serial}" --list-encoders`)

  const stdout = res.stdout

  const value = parseScrcpyCodecList(stdout)

  return value
}

async function mirror(...args) {
  return createMirrorProcess(...args)
}

async function mirrorEmbedded(serial, options = {}) {
  return createMirrorProcess(serial, {
    ...options,
    executable: extraResolve('win/scrcpy/scrcpy.exe'),
  })
}

async function record(serial, { title, args = '', savePath, ...options } = {}) {
  return createScrcpyProcess(
    `--serial="${serial}" --window-title="${title}" --record="${savePath}" ${args}`,
    options,
  )
}

async function helper(
  serial,
  command = '',
  options = {},
) {
  const stringCommand = commandHelper.stringify(command)

  return createScrcpyProcess(
    `--serial="${serial}" --no-window --no-video --no-audio ${stringCommand}`,
    options,
  )
}

async function getAppList(serial) {
  const res = await createScrcpyProcess(`--serial="${serial}" --list-apps`)

  const stdout = res.stdout

  const value = parseScrcpyAppList(stdout)

  return value
}

async function getDisplayIds(serial) {
  const res = await createScrcpyProcess(`--serial="${serial}" --list-displays`)

  const stdout = res.stdout

  const value = parseDisplayIds(stdout)

  return value
}

async function getCameraList(serial, options) {
  const res = await createScrcpyProcess(`--serial="${serial}" --list-cameras`)

  const stdout = res.stdout

  const value = parseScrcpyCameras(stdout, options)

  return value
}

async function launch(serial, args = {}) {
  let { commands = '', packageName, useNewDisplay = true, newDisplay = '', landscape, ...options } = args

  if (useNewDisplay) {
    commands += newDisplay
      ? ` --new-display=${newDisplay}`
      : ' --new-display'
  }

  if (landscape || !useNewDisplay) {
    commands = commands.replace(/\s*--flex-display\s*/g, ' ')
  }

  if (packageName && !['unknown'].includes(packageName)) {
    commands += ` --start-app=${packageName}`
  }

  const promise = {
    resolve: null,
  }

  const signalText = /New display:.+?\(id=(\d+)\)/i

  const child = createMirrorProcess(serial, {
    ...options,
    args: commands,
    stdout: (data) => {
      const matchList = data.match(signalText)

      if (!matchList?.length) {
        return false
      }

      const displayId = matchList[1]

      if (!displayId && useNewDisplay) {
        throw new Error('The display ID was not obtained.')
      }

      promise?.resolve?.(displayId)
    },
  })

  return new Promise((resolve, reject) => {
    let settled = false

    function resolveOnce(value) {
      if (settled) {
        return
      }

      settled = true
      resolve(value)
    }

    function rejectOnce(error) {
      if (settled) {
        return
      }

      settled = true
      reject(error)
    }

    promise.resolve = resolveOnce

    if (!useNewDisplay) {
      child.once('spawn', () => {
        resolveOnce()
      })
    }

    child.then(resolveOnce).catch(rejectOnce)
  })
}

async function killProcesses() {
  return processManager.kill()
}

export default {
  shell,
  getEncoders,
  mirror,
  mirrorEmbedded,
  record,
  launch,
  helper,
  getAppList,
  getDisplayIds,
  getCameraList,
  killProcesses,
}
