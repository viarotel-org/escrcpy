import util from 'node:util'
import { exec as _exec, spawn } from 'node:child_process'
import appStore from '@electron/helpers/store.js'
import { adbPath, scrcpyPath } from '@electron/configs/index.js'

const exec = util.promisify(_exec)

const shell = async (command, { stdout, stderr } = {}) => {
  const spawnPath = appStore.get('common.scrcpyPath') || scrcpyPath
  const ADB = appStore.get('common.adbPath') || adbPath
  const args = command.split(' ')

  console.log('scrcpy.shell.spawnPath', spawnPath)
  console.log('scrcpy.shell.ADB', ADB)
  console.log('scrcpy.shell.args', args)

  const scrcpyProcess = spawn(`"${spawnPath}"`, args, {
    env: { ...process.env, ADB },
    shell: true,
    encoding: 'utf8',
  })

  scrcpyProcess.stdout.on('data', (data) => {
    const stringData = data.toString()

    console.log('scrcpyProcess.stdout.data:', stringData)

    if (stdout) {
      stdout(stringData, scrcpyProcess)
    }
  })

  scrcpyProcess.stderr.on('data', (data) => {
    const stringData = data.toString()

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
        reject(new Error(`Command failed with code ${code}`))
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

  console.log('scrcpy.execShell.spawnPath', spawnPath)
  console.log('scrcpy.execShell.ADB', ADB)
  console.log('scrcpy.shell.command', command)

  const res = exec(`"${spawnPath}" ${command}`, {
    env: { ...process.env, ADB },
    shell: true,
    encoding: 'utf8',
  })

  return res
}

const getEncoders = async (serial) => {
  const res = await execShell(`--serial="${serial}" --list-encoders`)
  // console.log('getEncoders.res', res)
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

  console.log('getEncoders.value', value)

  return value
}

export default () => ({
  shell,
  execShell,
  getEncoders,
})
