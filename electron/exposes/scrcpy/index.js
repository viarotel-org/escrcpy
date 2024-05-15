import util from 'node:util'
import { exec as _exec, spawn } from 'node:child_process'
import { replaceIP, sleep } from '$renderer/utils/index.js'
import appStore from '$electron/helpers/store.js'
import { adbPath, scrcpyPath } from '$electron/configs/index.js'

let adbkit

const exec = util.promisify(_exec)

const shell = async (command, { stdout, stderr } = {}) => {
  const spawnPath = appStore.get('common.scrcpyPath') || scrcpyPath
  const ADB = appStore.get('common.adbPath') || adbPath
  const args = command.split(' ')

  const scrcpyProcess = spawn(`"${spawnPath}"`, args, {
    env: { ...process.env, ADB },
    shell: true,
    encoding: 'utf8',
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

const execShell = async (command) => {
  const spawnPath = appStore.get('common.scrcpyPath') || scrcpyPath
  const ADB = appStore.get('common.adbPath') || adbPath

  const res = exec(`"${spawnPath}" ${command}`, {
    env: { ...process.env, ADB },
    shell: true,
    encoding: 'utf8',
  })

  return res
}

const getEncoders = async (serial) => {
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

const mirror = async (
  serial,
  { title, args = '', exec = false, ...options } = {},
) => {
  const mirrorShell = exec ? execShell : shell

  return mirrorShell(
    `--serial="${serial}" --window-title="${title}" ${args}`,
    options,
  )
}

const record = async (
  serial,
  { title, args = '', savePath, ...options } = {},
) => {
  return shell(
    `--serial="${serial}" --window-title="${title}" --record="${savePath}" ${args}`,
    options,
  )
}

const mirrorGroup = async (serial, { open = 1, ...options } = {}) => {
  const overlayDisplay
    = appStore.get(`scrcpy.${replaceIP(serial)}.--display-overlay`)
    || appStore.get('scrcpy.global.--display-overlay')
    || '1080x1920/320,secure'

  const command = `settings put global overlay_display_devices "${[
    ...Array.from({ length: open }).keys(),
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

export default (options = {}) => {
  adbkit = options.adbkit

  return {
    shell,
    execShell,
    getEncoders,
    mirror,
    record,
    mirrorGroup,
  }
}
