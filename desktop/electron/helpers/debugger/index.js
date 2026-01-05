import { shell } from 'electron'
import electronLog from 'electron-log/main'

electronLog.initialize({ preload: true })

export function getLogPath() {
  return electronLog.transports.file.getFile()?.path
}

export function openLogPath() {
  return shell.openPath(getLogPath())
}
