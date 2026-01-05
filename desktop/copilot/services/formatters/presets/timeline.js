/**
 * 序号列表格式化器
 * 以有序列表形式展示自动化执行流程
 */
import BaseFormatter from './base.js'

class NumberedListFormatter extends BaseFormatter {
  constructor(options = {}) {
    super(options)
  }

  /**
   * 格式化键盘事件
   * 使用 build-md 生成标准 HTML 格式，确保在 markdown 中正确渲染
   */
  formatKeyboard({ event, time, message, payload, context }) {
    const { success } = payload
    const statusText = success !== undefined ? ` (success: ${success})` : ''

    // 使用 HTML 标签确保换行和格式正确
    return this.md`${this.listMarker()} ${this.icons.keyboard} ${this.md.bold(event)} - ${time}\n\n${message}${statusText}\n\n`.toString()
  }

  /**
   * 格式化思考事件
   * 处理多行文本，使用 HTML 换行和缩进
   */
  formatThinking({ event, time, message, payload, context }) {
    return this.md`${this.listMarker()} ${this.icons.thinking} ${this.md.bold(event)} - ${time}\n\n${message}\n\n`.toString()
  }

  /**
   * 格式化动作事件
   */
  formatAction({ event, time, message, payload, context }) {
    const codeBlock = this.codeBlockJson(message || {})

    return this.md`${this.listMarker()} ${this.icons.action} ${this.md.bold(event)} - ${time}\n\n${codeBlock}\n\n`.toString()
  }

  /**
   * 格式化任务完成事件
   */
  formatTaskComplete({ event, time, message, payload, context }) {
    const cleanMessage = this.removeQuotes(message)

    return this.md`${this.listMarker()} ${this.icons.taskComplete} ${this.md.bold(event)} - ${time}\n\n${cleanMessage}\n\n`.toString()
  }

  /**
   * 格式化日志事件
   */
  formatLog({ event, time, message, payload, context }) {
    return this.md`${this.listMarker()} ${this.icons.log} ${this.md.bold(event)} - ${time}\n\n${message}\n\n`.toString()
  }

  /**
   * 格式化消息事件
   */
  formatMessage({ event, time, message, payload, context }) {
    return this.md`${this.listMarker()} ${this.icons.message} ${this.md.bold(event)} - ${time}\n\n${message}\n\n`.toString()
  }

  /**
   * 格式化错误事件
   * 安全提取错误信息
   */
  formatError({ event, time, message, payload, context }) {
    const errorMsg = message?.message || message?.toString() || 'Unknown Error'

    return this.md`${this.listMarker()} ${this.icons.error} ${this.md.bold(event)} - ${time}\n\n${errorMsg}\n\n`.toString()
  }
}

export default NumberedListFormatter
