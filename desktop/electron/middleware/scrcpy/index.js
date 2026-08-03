import { electronAPI } from '@electron-toolkit/preload'
import { sheller } from '$electron/helpers/shell/index.js'
import commandHelper from '$renderer/utils/command/index.js'
import { createDeferred } from '$renderer/utils/index.js'

import { ProcessManager } from '$electron/process/manager.js'

import { parseDisplayIds, parseScrcpyAppList, parseScrcpyCameras, parseScrcpyCodecList } from './helper.js'

const processManager = new ProcessManager()

electronAPI.ipcRenderer.on('quit-before', () => {
  processManager.kill()
})

function normalizeScrcpyError(error) {
  const message = error?.stderr || error?.message || String(error)
  throw new Error(message)
}

function createScrcpyProcess(command, options = {}) {
  let mirrorProcess = null

  const {
    args = '',
    resolveOnReady = false,
    resolveOnSpawn = false,
    readyPattern = /(?:Renderer:|Texture:|\[server\]\s+INFO:\s+Device:)/i,
    getReadyValue = () => void 0,
    readyErrorMessage = 'scrcpy process exited before ready',
    stdout,
    stderr,
    ...shellerOptions
  } = options

  const readyDeferred = resolveOnReady || resolveOnSpawn
    ? createDeferred()
    : null

  function resolveReady(data) {
    if (!readyDeferred || !resolveOnReady) {
      return
    }

    const text = String(data)

    if (!text.trim()) {
      return
    }

    readyPattern.lastIndex = 0

    const matchList = text.match(readyPattern)

    if (!matchList) {
      return
    }

    try {
      readyDeferred.resolve(getReadyValue(matchList, text))
    }
    catch (error) {
      readyDeferred.reject(error)
    }
  }

  mirrorProcess = sheller(`scrcpy ${command}`, {
    shell: true,
    encoding: 'utf8',
    ...shellerOptions,

    stdout: (data) => {
      stdout?.(data, mirrorProcess)
      resolveReady(data)
    },

    stderr: (data) => {
      stderr?.(data, mirrorProcess)
      resolveReady(data)
    },
  })

  processManager.add(mirrorProcess)

  if (resolveOnSpawn) {
    mirrorProcess.once('spawn', () => {
      readyDeferred?.resolve()
    })
  }

  const exitPromise = mirrorProcess
    .then((result) => {
      readyDeferred?.reject(new Error(readyErrorMessage))
      return result
    })
    .catch((error) => {
      readyDeferred?.reject(error)
      normalizeScrcpyError(error)
    })

  const promise = readyDeferred
    ? readyDeferred.promise
    : exitPromise

  return Object.assign(mirrorProcess, {
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
    {
      resolveOnReady: true,
      ...options,
    },
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
  let {
    commands = '',
    packageName,
    useNewDisplay = true,
    newDisplay = '',
    landscape,
    ...options
  } = args

  if (useNewDisplay) {
    commands += newDisplay
      ? ` --new-display=${newDisplay}`
      : ' --new-display'
  }

  if (landscape || !useNewDisplay) {
    commands = commands.replace(/\s*--flex-display\s*/g, ' ')
  }

  if (packageName && packageName !== 'unknown') {
    commands += ` --start-app=${packageName}`
  }

  return createMirrorProcess(serial, {
    ...options,
    args: commands,
    resolveOnReady: useNewDisplay,
    resolveOnSpawn: !useNewDisplay,
    readyPattern: /New display:.+?\(id=(\d+)\)/i,
    getReadyValue: (matchList) => {
      const displayId = matchList[1]

      if (!displayId) {
        throw new Error('The display ID was not obtained.')
      }

      return displayId
    },
    readyErrorMessage: useNewDisplay
      ? 'scrcpy exited before new display was created'
      : 'scrcpy exited before spawn',
  })
}

async function killProcesses() {
  return processManager.kill()
}

export default {
  shell,
  getEncoders,
  mirror,
  record,
  launch,
  helper,
  getAppList,
  getDisplayIds,
  getCameraList,
  killProcesses,
}
