import { spawn } from 'node:child_process'
import { adbPath, scrcpyPath } from '@electron/configs/index.js'

const shell = async (command, { stdout, stderr } = {}) => {
  const args = command.split(' ')
  const scrcpyProcess = spawn(scrcpyPath, args, {
    env: { ...process.env, ADB: adbPath },
    shell: true,
  })

  scrcpyProcess.stdout.on('data', (data) => {
    const stringData = data.toString()

    console.log('scrcpyProcess.stdout.data:', stringData)

    if (stdout) {
      stdout(stringData)
    }
  })

  scrcpyProcess.stderr.on('data', (data) => {
    const stringData = data.toString()

    console.error('scrcpyProcess.stderr.data:', stringData)

    if (stderr) {
      stderr(stringData)
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
