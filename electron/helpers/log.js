import { createProxy } from '$electron/helpers/index'
import { shell } from 'electron'
import log from 'electron-log/main.js'

log.transports.console.level = false

const levels = Object.keys(log.functions)

const getFilePath = () => log.transports.file.getFile()?.path

export default {
  ...createProxy(log, ['initialize', ...levels]),
  levels,
  functions: createProxy(log, levels),
  getFilePath,
  openInEditor: () => shell.openPath(getFilePath()),
}
