import { createProxy } from './index.js'

Object.assign(console, {
  ...createProxy(window.appLog.functions, window.appLog.levels),
  raw: console.log,
})
