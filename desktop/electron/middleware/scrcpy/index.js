import { exec as _exec, spawn } from 'node:child_process'
import util from 'node:util'
import { electronAPI } from '@electron-toolkit/preload'
import { getAdbPath, getScrcpyPath } from '$electron/configs/which/index.js'
import electronStore from '$electron/helpers/store/index.js'
import commandHelper from '$renderer/utils/command/index.js'

import { ProcessManager } from '$electron/process/manager.js'

import { getDisplayOverlay, parseDisplayIds, parseScrcpyAppList, parseScrcpyCodecList } from './helper.js'

const exec = util.promisify(_exec)

const processManager = new ProcessManager()

electronAPI.ipcRenderer.on('quit-before', () => {
  processManager.kill()
})

async function shell(command, { stdout, stderr, signal, ...options } = {}) {
  const spawnPath = getScrcpyPath()
  const ADB = getAdbPath()
  const args = command.split(' ')

  const scrcpyProcess = spawn(`"${spawnPath}"`, args, {
    env: { ...process.env, ADB },
    shell: true,
    encoding: 'utf8',
    ...options,
  })

  processManager.add(scrcpyProcess)

  const stderrList = []

  return new Promise((resolve, reject) => {
    scrcpyProcess.stdout.on('data', (data) => {
      const stringData = data.toString()

      if (stdout) {
        stdout(stringData, scrcpyProcess)
      }

      const matchList = stringData.match(signal)

      if (matchList) {
        resolve(matchList, stringData, scrcpyProcess)
      }
    })

    scrcpyProcess.stderr.on('data', (data) => {
      const stringData = data.toString()

      stderrList.push(stringData)

      console.error('scrcpyProcess.stderr.data:', stringData)

      if (stderr) {
        stderr(stringData, scrcpyProcess)
      }
    })

    scrcpyProcess.on('close', (code) => {
      if (code === 0) {
        resolve()
      }
      else {
        reject(
          new Error(stderrList.join(',') || `Command failed with code ${code}`),
        )
      }
    })

    scrcpyProcess.on('error', (err) => {
      reject(err)
    })
  })
}

async function execShell(command) {
  const spawnPath = getScrcpyPath()
  const ADB = getAdbPath()

  const scrcpyProcess = exec(`"${spawnPath}" ${command}`, {
    env: { ...process.env, ADB },
    shell: true,
    encoding: 'utf8',
  })

  processManager.add(scrcpyProcess.child)

  return scrcpyProcess
}

async function getEncoders(serial) {
  const res = await execShell(`--serial="${serial}" --list-encoders`)

  const stdout = res.stdout

  const value = parseScrcpyCodecList(stdout)

  return value
}

async function mirror(
  serial,
  { title, args = '', exec = false, ...options } = {},
) {
  const currentShell = exec ? execShell : shell

  return currentShell(
    `--serial="${serial}" --window-title="${title}" ${args}`,
    options,
  )
}

async function record(serial, { title, args = '', exec = false, savePath, ...options } = {}) {
  const currentShell = exec ? execShell : shell

  return currentShell(
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

  return execShell(
    `--serial="${serial}" --no-window --no-video --no-audio ${stringCommand}`,
    options,
  )
}

async function getAppList(serial) {
  const res = await execShell(`--serial="${serial}" --list-apps`)

  const stdout = res.stdout
  const value = parseScrcpyAppList(stdout)

  return value
}

async function getDisplayIds(serial) {
  const res = await execShell(`--serial="${serial}" --list-displays`)

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

  const res = await mirror(serial, { ...options, args: commands, signal: /New display:.+?\(id=(\d+)\)/i })

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
  execShell,
  getEncoders,
  mirror,
  record,
  helper,
  getAppList,
  startApp,
  getDisplayIds,
  killProcesses,
}
