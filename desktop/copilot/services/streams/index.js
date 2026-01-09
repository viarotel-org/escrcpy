/**
 * Manage the event flow status
 */
class EventStreamManager {
  constructor() {
    this.streams = new Map()
  }

  get(id, type) {
    const stream = this.streams.get(id)
    return stream?.[type]
  }

  set(id, type, flag) {
    if (!this.streams.has(id)) {
      this.streams.set(id, {})
    }

    this.streams.get(id)[type] = flag
  }

  remove(id) {
    this.streams.delete(id)
  }
}

export const eventStreamManager = new EventStreamManager()
