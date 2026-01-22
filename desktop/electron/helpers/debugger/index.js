import { app, shell } from 'electron'
import electronLog from 'electron-log/main'
import path from 'node:path'

electronLog.transports.file.resolvePathFn = () => {
  const value = path.join(app.getPath('logs'), 'main.log')
  return value
}

electronLog.initialize({ preload: true })

export function getLogPath() {
  return electronLog.transports.file.getFile()?.path
}

export function openLogPath() {
  return shell.openPath(getLogPath())
}
