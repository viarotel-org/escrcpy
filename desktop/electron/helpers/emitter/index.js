import { EventEmitter } from 'node:events'
import { eventLimiter } from './helper'

/**
 * Auto install event limiter in development mode
 */
if (import.meta.env.MODE === 'development') {
  eventLimiter.install(EventEmitter)
}

const globalEventEmitter = new EventEmitter({ captureRejections: true })

export {
  EventEmitter,
  globalEventEmitter,
}
