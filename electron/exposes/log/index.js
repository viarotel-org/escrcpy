import { createProxy } from '$electron/helpers/index'
import log from 'electron-log/main.js'

const levels = Object.keys(log.functions)

const functions = () => ({ ...createProxy(log, levels) })

export default {
  levels,
  functions: functions(),
  ...functions(),
}
