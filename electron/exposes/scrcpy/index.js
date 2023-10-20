import { spawn } from 'node:child_process'
import _which from 'which'
import appStore from '@electron/helpers/store.js'
import { adbPath, scrcpyPath } from '@electron/configs/index.js'

const shell = async (command, { stdout, stderr } = {}) => {
  const spawnPath = appStore.get('scrcpy.global.scrcpyPath') || scrcpyPath
  const args = command.split(' ')

  const scrcpyProcess = spawn(spawnPath, args, {
    env: { ...process.env, ADB: adbPath },
    shell: true,
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

const which = async () => _which('scrcpy')

export default () => ({
  shell,
  which,
})
