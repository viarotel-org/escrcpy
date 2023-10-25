import log from '@electron/helpers/log.js'

import { createProxy } from './index.js'

Object.assign(console, {
  ...createProxy(log.functions, log.levels),
  raw: console.log,
})
