/**
 * 基础格式化器 - 定义格式化器标准接口
 * 所有格式化器都应继承此类并实现相应方法
 */
import { md } from 'build-md'
import dayjs from 'dayjs'

class BaseFormatter {
  constructor(options = {}) {
    this.options = options

    this.md = md

    this.icons = {
      keyboard: '⌨️',
      thinking: '🤔',
      action: '▶️',
      taskComplete: '✅',
      log: '📝',
      message: '💬',
      error: '❌',
      default: '📌',
      aborted: '❗',
    }

    this.listMarker = () => this.md.list([''])
  }

  /**
   * 格式化事件
   * @param {string} event - 事件类型 (keyboard, thinking, action, task_complete, etc.)
   * @param {object} payload - 事件数据 {message, time, success, ...}
   * @param {object} context - 上下文信息 {stepNumber, sessionId, ...}
   * @returns {string} 格式化后的文本
   */
  format(event, payload, context = {}) {
    if (!payload) {
      return this.formatEmpty(event)
    }

    const { time = dayjs().format('YYYY-MM-DD HH:mm:ss'), message } = payload

    const methodMap = {
      keyboard: 'formatKeyboard',
      thinking: 'formatThinking',
      action: 'formatAction',
      task_complete: 'formatTaskComplete',
      log: 'formatLog',
      message: 'formatMessage',
      error: 'formatError',
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

  /**
   * 工具方法：生成代码块格式化文本
   */
  codeBlockJson(obj) {
    return this.md`${this.md.codeBlock('json', JSON.stringify(obj, null, 2))}`.toString()
  }

  listMarker() {
    return this.md.list(['']).trim()
  }

  /**
   * 格式化空事件（无 payload）
   */
  formatEmpty() {
    return ''
  }

  /**
   * 格式化默认事件（未知类型）
   * 使用 build-md 确保格式正确
   */
  formatDefault({ event, time, message }) {
    return this.md`${this.listMarker()} ${this.icons[event] || this.icons.default} ${this.md.bold(event)}\n\n${this.codeBlockJson({ message, time })}\n\n`.toString()
  }

  /**
   * 以下方法应由子类实现
   */
  formatKeyboard(time, message, payload, context) {
    throw new Error('formatKeyboard must be implemented by subclass')
  }

  formatThinking(time, message, payload, context) {
    throw new Error('formatThinking must be implemented by subclass')
  }

  formatAction(time, message, payload, context) {
    throw new Error('formatAction must be implemented by subclass')
  }

  formatTaskComplete(time, message, payload, context) {
    throw new Error('formatTaskComplete must be implemented by subclass')
  }

  formatLog(time, message, payload, context) {
    throw new Error('formatLog must be implemented by subclass')
  }

  formatMessage(time, message, payload, context) {
    throw new Error('formatMessage must be implemented by subclass')
  }

  formatError(time, message, payload, context) {
    throw new Error('formatError must be implemented by subclass')
  }

  /**
   * 工具方法：移除引号
   * 使用正则表达式安全处理引号
   */
  removeQuotes(text) {
    if (typeof text !== 'string')
      return text
    return text.replace(/^["']|["']$/g, '')
  }
}

export default BaseFormatter
