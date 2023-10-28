import { spawn } from 'node:child_process'
import appStore from '@electron/helpers/store.js'
import { adbPath, scrcpyPath } from '@electron/configs/index.js'

const shell = async (command, { stdout, stderr } = {}) => {
  const spawnPath = appStore.get('common.scrcpyPath') || scrcpyPath
  const ADB = appStore.get('common.adbPath') || adbPath
  const args = command.split(' ')

  console.log('scrcpy.shell.spawnPath', spawnPath)
  console.log('scrcpy.shell.ADB', ADB)

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

export default () => ({
  shell,
})
