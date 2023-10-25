import log from 'electron-log/main'
import { createProxy } from '@electron/helpers/index'

const levels = Object.keys(log.functions)

const functions = () => ({ ...createProxy(log, levels) })

export default {
  levels,
  functions: functions(),
  ...functions(),
}
