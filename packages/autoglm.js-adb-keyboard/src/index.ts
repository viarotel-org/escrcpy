import path from 'node:path'
import { __dirname } from '@autoglm.js/shared'
import { runAdbCommand } from 'autoglm.js'

async function cleanupPendingInstallations(deviceId?: string) {
  await runAdbCommand(deviceId, ['shell', 'pm', 'list', 'installations'])
  await runAdbCommand(deviceId, ['shell', 'pm', 'clear', 'com.android.packageinstaller'])
}

export async function installKeyboard(deviceId?: string, customApkPath?: string) {
  const apkPath = customApkPath ?? path.join(__dirname, '../ADBKeyboard.apk')
  await cleanupPendingInstallations(deviceId)

  const installOutput = await runAdbCommand(deviceId, ['install', apkPath])
  if (installOutput.exitCode !== 0) {
    throw new Error(`Failed to install ADBKeyboard APK: ${installOutput.stderr}`)
  }

  await runAdbCommand(deviceId, ['shell', 'ime', 'enable', 'com.android.adbkeyboard/.AdbIME'])
}
