/**
 * Numbered List Formatter
 */
import BaseFormatter from './base.js'
import { eventStreamManager } from '$copilot/services/streams/index.js'

class NumberedListFormatter extends BaseFormatter {
  constructor(options = {}) {
    super(options)
  }

  formatStart({ event, time, message, payload, context }) {
    return this.md`${this.listMarker()} ${this.icons.start} ${this.formatTitle(event)} - ${time}\n\n${message}\n\n`.toString()
  }

  formatThinking({ event, time, message, payload, context }) {
    const thinking = eventStreamManager.get(context.sessionId, 'thinking')

    if (thinking) {
      eventStreamManager.set(context.sessionId, 'thinking', false)
      return '\n\n'
    }

    return this.md`${this.listMarker()} ${this.icons.thinking} ${this.formatTitle(event)} - ${time}\n\n${message}\n\n`.toString()
  }

  formatThinkingStream({ event, time, message, payload, context }) {
    const thinking = eventStreamManager.get(context.sessionId, 'thinking')

    if (thinking) {
      return message
    }

    eventStreamManager.set(context.sessionId, 'thinking', true)

    return this.md`${this.listMarker()} ${this.icons.thinking} ${this.formatTitle('thinking')} - ${time}\n\n${message}`.toString()
  }

  formatAction({ event, time, message, payload, context }) {
    const codeBlock = this.formatCode(message || {})

    return this.md`${this.listMarker()} ${this.icons.action} ${this.formatTitle(event)} - ${time}\n\n${codeBlock}\n\n`.toString()
  }

  formatTaskComplete({ event, time, message, payload, context }) {
    return this.md`${this.listMarker()} ${this.icons.taskComplete} ${this.formatTitle(event)} - ${time}\n\n${this.removeQuotes(message)}\n\n`.toString()
  }

  formatMessage({ event, time, message, payload, context }) {
    return this.md`${this.listMarker()} ${this.icons.message} ${this.formatTitle(event)} - ${time}\n\n${message}\n\n`.toString()
  }

  formatError({ event, time, message, payload, context }) {
    const errorMsg = message?.message || message?.toString() || 'Unknown Error'

    return this.md`${this.listMarker()} ${this.icons.error} ${this.formatTitle(event)} - ${time}\n\n${errorMsg}\n\n`.toString()
  }

  formatAborted({ event, time, message, payload, context }) {
    return this.md`${this.listMarker()} ${this.icons.aborted} ${this.formatTitle(event)} - ${time}\n\n${message}\n\n`.toString()
  }
}

export default NumberedListFormatter
