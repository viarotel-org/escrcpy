import { EventEmitter } from 'node:events'
import { eventLimiter } from './helper'

/**
 * Auto install event limiter in development mode
 */
if (process.env.IS_PACKAGED !== 'true') {
  eventLimiter.install(EventEmitter)
}

const globalEventEmitter = new EventEmitter({ captureRejections: true })

export {
  EventEmitter,
  globalEventEmitter,
}
