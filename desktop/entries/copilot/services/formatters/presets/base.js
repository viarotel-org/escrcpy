/**
 * Base Formatter
 */
import { md } from 'build-md'
import dayjs from 'dayjs'

class BaseFormatter {
  constructor(options = {}) {
    this.options = options

    this.md = md

    this.icons = {
      default: '📌',
      start: '🚀',
      thinking: '🤔',
      action: '🤖',
      taskComplete: '✅',
      error: '❌',
      aborted: '❗',
    }

    this.listMarker = () => this.md.list([''])
  }

  /**
   * Format an event
   * @param {string} event - Event type (keyboard, thinking, action, task_complete, etc.)
   * @param {object} payload - Event payload {message, time, success, ...}
   * @param {object} context - Context info {stepNumber, sessionId, ...}
   * @returns {string} Formatted text
   */
  format(event, payload, context = {}) {
    if (!payload) {
      return this.formatEmpty(event)
    }

    const { time = dayjs().format('YYYY-MM-DD HH:mm:ss'), message } = payload

    const methodMap = {
      start: 'formatStart',
      thinking: 'formatThinking',
      thinking_stream: 'formatThinkingStream',
      action: 'formatAction',
      task_complete: 'formatTaskComplete',
      error: 'formatError',
      aborted: 'formatAborted',
    }

    const methodName = methodMap[event]

    if (methodName && typeof this[methodName] === 'function') {
      try {
        return this[methodName]({ time, message, payload, context, event })
      }
      catch (error) {
        console.error(`Error formatting event "${event}":`, message)
      }
    }

    return this.formatDefault({ event, time, message, context })
  }

  listMarker() {
    return this.md.list([''])
  }

  formatCode(obj) {
    return this.md`${this.md.codeBlock('json', JSON.stringify(obj, null, 2))}`.toString()
  }

  formatTitle(eventName) {
    return this.md.bold(window.t(`copilot.event.${eventName}`)).toString()
  }

  formatEmpty() {
    return ''
  }

  formatDefault({ event, time, message }) {
    return this.md`${this.listMarker()} ${this.icons[event] || this.icons.default} ${this.md.bold(event)}\n\n${this.formatCode({ message, time })}\n\n`.toString()
  }

  formatStart() {
    throw new Error('formatStart must be implemented by subclass')
  }

  formatThinking() {
    throw new Error('formatThinking must be implemented by subclass')
  }

  formatThinkingStream() {
    throw new Error('formatThinkingStream must be implemented by subclass')
  }

  formatAction() {
    throw new Error('formatAction must be implemented by subclass')
  }

  formatTaskComplete() {
    throw new Error('formatTaskComplete must be implemented by subclass')
  }

  formatAborted() {
    throw new Error('formatAborted must be implemented by subclass')
  }

  formatError() {
    throw new Error('formatError must be implemented by subclass')
  }

  removeQuotes(text) {
    if (typeof text !== 'string') {
      return text
    }

    if (
      (text.startsWith('"') && text.endsWith('"'))
      || (text.startsWith('\'') && text.endsWith('\''))
    ) {
      return text.slice(1, -1)
    }

    return text
  }
}

export default BaseFormatter
