import { electronAPI } from '@electron-toolkit/preload'
import electronStore from '$electron/helpers/store/index.js'
import { sheller } from '$electron/helpers/shell/index.js'
import commandHelper from '$renderer/utils/command/index.js'

import { ProcessManager } from '$electron/process/manager.js'

import { getDisplayOverlay, parseDisplayIds, parseScrcpyAppList, parseScrcpyCodecList } from './helper.js'

const processManager = new ProcessManager()

electronAPI.ipcRenderer.on('quit-before', () => {
  processManager.kill()
})

async function shell(command, options = {}) {
  const scrcpyProcess = sheller(`scrcpy ${command}`, {
    shell: true,
    encoding: 'utf8',
    ...options,
    stderr: (data) => {
      options?.stderr?.(data, scrcpyProcess)
      console.error('scrcpyProcess.stderr.data:', data)
    },
  })

  processManager.add(scrcpyProcess)

  return scrcpyProcess.catch((error) => {
    const message = error?.stderr || error?.message
    throw new Error(message)
  })
}

async function getEncoders(serial) {
  const res = await shell(`--serial="${serial}" --list-encoders`)

  const stdout = res.stdout

  const value = parseScrcpyCodecList(stdout)

  return value
}

async function mirror(
  serial,
  { title, args = '', ...options } = {},
) {
  return shell(
    `--serial="${serial}" --window-title="${title}" ${args}`,
    options,
  )
}

async function record(serial, { title, args = '', savePath, ...options } = {}) {
  return shell(
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

  return shell(
    `--serial="${serial}" --no-window --no-video --no-audio ${stringCommand}`,
    options,
  )
}

async function getAppList(serial) {
  const res = await shell(`--serial="${serial}" --list-apps`)

  const stdout = res.stdout

  const value = parseScrcpyAppList(stdout)

  return value
}

async function getDisplayIds(serial) {
  const res = await shell(`--serial="${serial}" --list-displays`)

  const stdout = res.stdout

  const value = parseDisplayIds(stdout)

  return value
}

async function startApp(serial, args = {}) {
  let { commands, packageName, useNewDisplay = true, ...options } = args

  if (useNewDisplay) {
    commands += ` --new-display`

    const displayOverlay = getDisplayOverlay(serial)

    if (displayOverlay) {
      commands += `=${displayOverlay}`
    }

    const imeFix = electronStore.get('common.imeFix')

    if (imeFix) {
      commands += ` --display-ime-policy=local`
    }

    const noVdDestroyContent = electronStore.get('common.noVdDestroyContent')

    if (noVdDestroyContent) {
      commands += ` --no-vd-destroy-content`
    }
  }

  if (packageName) {
    commands += ` --start-app=${packageName}`
  }

  const promise = {
    resolve: null,
  }

  const signalText = /New display:.+?\(id=(\d+)\)/i

  const child = mirror(serial, {
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
    promise.resolve = resolve
    child.then(resolve).catch(reject)
  })
}

function killProcesses() {
  processManager.kill()
}

export default {
  shell,
  getEncoders,
  mirror,
  record,
  helper,
  getAppList,
  startApp,
  getDisplayIds,
  killProcesses,
}
