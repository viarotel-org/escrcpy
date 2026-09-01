import { app } from 'electron'
import os from 'node:os'
import { compare } from 'compare-versions'
import electronStore from '$electron/helpers/store/index.js'
import { setupEnvPath } from './helper.js'

const currentVersion = app.getVersion()
const storedVersion = electronStore.get('version') || '0.0.1'

if (compare(currentVersion, storedVersion, '!=')) {
  electronStore.delete('common.scrcpyDir')
  electronStore.delete('common.adbDir')
  electronStore.delete('common.gnirehtetDir')
  electronStore.set('version', currentVersion)
}

// Set default saveDir if not set
if (!electronStore.get('common.saveDir')) {
  electronStore.set('common.saveDir', process.env.DESKTOP_PATH)
}

setupEnvPath()

// Disable GPU Acceleration for Windows 7
if (process.platform === 'win32' && os.release().startsWith('6.1')) {
  app.disableHardwareAcceleration()
}

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') {
  app.setAppUserModelId(app.getName())
}
