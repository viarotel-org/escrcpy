import { exec as _exec, spawn } from 'node:child_process'
import util from 'node:util'
import { adbPath, scrcpyPath } from '$electron/configs/index.js'
import appStore from '$electron/helpers/store.js'
import { replaceIP, sleep } from '$renderer/utils/index.js'
import commandHelper from '$renderer/utils/command/index.js'

let adbkit

const exec = util.promisify(_exec)

async function shell(command, { stdout, stderr, ...options } = {}) {
  const spawnPath = appStore.get('common.scrcpyPath') || scrcpyPath
  const ADB = appStore.get('common.adbPath') || adbPath
  const args = command.split(' ')

  const scrcpyProcess = spawn(`"${spawnPath}"`, args, {
    env: { ...process.env, ADB },
    shell: true,
    encoding: 'utf8',
    ...options,
  })

  scrcpyProcess.stdout.on('data', (data) => {
    const stringData = data.toString()

    if (stdout) {
      stdout(stringData, scrcpyProcess)
    }
  })

  const stderrList = []
  scrcpyProcess.stderr.on('data', (data) => {
    const stringData = data.toString()

    stderrList.push(stringData)

    console.error('scrcpyProcess.stderr.data:', stringData)

    if (stderr) {
      stderr(stringData, scrcpyProcess)
    }
  })

  return new Promise((resolve, reject) => {
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
  const spawnPath = appStore.get('common.scrcpyPath') || scrcpyPath
  const ADB = appStore.get('common.adbPath') || adbPath

  const res = exec(`"${spawnPath}" ${command}`, {
    env: { ...process.env, ADB },
    shell: true,
    encoding: 'utf8',
  })

  return res
}

async function getEncoders(serial) {
  const res = await execShell(`--serial="${serial}" --list-encoders`)
  const stdout = res.stdout

  // 提取视频编码器列表
  const videoEncoderRegex
    = /--video-codec=([\w-]+)\s+--video-encoder='([^']+)'/g
  const videoEncoders = [...stdout.matchAll(videoEncoderRegex)].map(
    ([, codec, encoder]) => ({ decoder: codec, encoder }),
  )

  // 提取音频编码器列表
  const audioEncoderRegex
    = /--audio-codec=([\w-]+)\s+--audio-encoder='([^']+)'/g
  const audioEncoders = [...stdout.matchAll(audioEncoderRegex)].map(
    ([, codec, encoder]) => ({ decoder: codec, encoder }),
  )

  const value = {
    audio: audioEncoders,
    video: videoEncoders,
  }

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

async function record(serial, { title, args = '', savePath, ...options } = {}) {
  return shell(
    `--serial="${serial}" --window-title="${title}" --record="${savePath}" ${args}`,
    options,
  )
}

async function mirrorGroup(serial, { openNum = 1, ...options } = {}) {
  const overlayDisplay
    = appStore.get(`scrcpy.${replaceIP(serial)}.--display-overlay`)
    || appStore.get('scrcpy.global.--display-overlay')
    || '1080x1920/320,secure'

  const command = `settings put global overlay_display_devices "${[
    ...Array.from({ length: openNum }).keys(),
  ]
    .map(() => overlayDisplay)
    .join(';')}"`

  await adbkit.deviceShell(serial, command)

  await sleep()

  const displayList = await adbkit.display(serial)

  const filterList = displayList.filter(item => item !== '0')

  const results = []

  for (let index = 0; index < filterList.length; index++) {
    const displayId = filterList[index]

    let args = options.args || ''

    if (args.includes('--display-id')) {
      args = args.replace(/(--display-id=)"[^"]*"/, `$1"${displayId}"`)
    }
    else {
      args += ` --display-id="${displayId}"`
    }

    const title = options?.title?.({ displayId, index }) || options?.title

    const promise = mirror(serial, {
      ...options,
      title,
      args,
      exec: true,
    })

    results.push(promise)

    await sleep(1500)
  }

  return Promise.allSettled(results)
}

async function helper(
  serial,
  command = '',
  { hiddenWindow = false, ...options } = {},
) {
  const stringCommand = commandHelper.stringify(command)

  return execShell(
    `--serial="${serial}" --window-title="EscrcpyHelper" ${
      hiddenWindow ? '--window-x=-300 --window-y=-300' : ''
    } --no-video --no-audio --mouse=disabled ${stringCommand}`,
    options,
  )
}

export default (options = {}) => {
  adbkit = options.adbkit

  return {
    shell,
    execShell,
    getEncoders,
    mirror,
    record,
    mirrorGroup,
    helper,
  }
}
