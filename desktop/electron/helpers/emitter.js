import { EventEmitter } from 'node:events'

/**
 * This is a custom event emitter that will warn if more than 10 listeners are registered for an event.
 */
if (process.env.IS_PACKAGED !== 'true') {
  const listenerMap = new Map()
  const originOn = EventEmitter.prototype.on
  EventEmitter.prototype.on = function (event, listener) {
    const count = (listenerMap.get(event) ?? 0) + 1
    listenerMap.set(event, count)

    if (count > 10) {
      console.warn(`[EventEmitter] More than 10 listeners registered for event: "${event}". Current count: ${count}`)
    }

    return originOn.call(this, event, listener)
  }
  const originRemoveListener = EventEmitter.prototype.removeListener
  EventEmitter.prototype.removeListener = function (event, listener) {
    const count = (listenerMap.get(event) ?? 1) - 1
    if (count <= 0) {
      listenerMap.delete(event)
    }
    else {
      listenerMap.set(event, count)
    }

    return originRemoveListener.call(this, event, listener)
  }
}

const eventEmitter = new EventEmitter({ captureRejections: true })

export {
  EventEmitter,
  eventEmitter,
}
