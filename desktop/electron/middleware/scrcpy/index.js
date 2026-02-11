import { electronAPI } from '@electron-toolkit/preload'
import { getAdbPath, getScrcpyPath } from '$electron/configs/which/index.js'
import electronStore from '$electron/helpers/store/index.js'
import { sheller } from '$electron/helpers/shell/index.js'
import commandHelper from '$renderer/utils/command/index.js'

import { ProcessManager } from '$electron/process/manager.js'

import { getDisplayOverlay, parseDisplayIds, parseScrcpyAppList, parseScrcpyCodecList } from './helper.js'

const processManager = new ProcessManager()

electronAPI.ipcRenderer.on('quit-before', () => {
  processManager.kill()
})

async function shell(command, { stdout, stderr, signalText, ...options } = {}) {
  const spawnPath = getScrcpyPath()
  const ADB = getAdbPath()
  const stderrList = []

  return new Promise((resolve, reject) => {
    let settled = false

    const finalize = (action, ...args) => {
      if (settled)
        return
      settled = true
      action(...args)
    }

    const scrcpyProcess = sheller(`"${spawnPath}" ${command}`, {
      env: { ...process.env, ADB },
      shell: true,
      encoding: 'utf8',
      ...options,
      stdout: (data) => {
        if (stdout)
          stdout(data, scrcpyProcess)

        if (signalText) {
          const matchList = data.match(signalText)
          if (matchList) {
            finalize(resolve, matchList, data, scrcpyProcess)
          }
        }
      },
      stderr: (data) => {
        if (stderr)
          stderr(data, scrcpyProcess)
        stderrList.push(data)
        console.error('scrcpyProcess.stderr.data:', data)
      },
    })

    processManager.add(scrcpyProcess)

    scrcpyProcess
      .then(() => finalize(resolve))
      .catch((error) => {
        const fallbackMessage = `Command failed with code ${error?.exitCode ?? 'unknown'}`
        const message = stderrList.join(',') || error?.stderr || error?.message || fallbackMessage
        finalize(reject, new Error(message))
      })
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
  }

  if (packageName) {
    commands += ` --start-app=${packageName}`
  }

  const res = await mirror(serial, { ...options, args: commands, signalText: /New display:.+?\(id=(\d+)\)/i })

  const displayId = res?.[1]

  if (!displayId && useNewDisplay) {
    throw new Error('The display ID was not obtained.')
  }

  return displayId
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
