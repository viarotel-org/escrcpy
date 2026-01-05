/**
 * 格式化器管理器
 * 提供格式化器的注册、获取和切换功能
 */
import TimelineFormatter from './presets/timeline.js'

class FormatterManager {
  constructor() {
    this.formatters = new Map()
    this.defaultFormatterType = 'timeline'

    // 注册内置格式化器
    this.register('timeline', TimelineFormatter)
  }

  /**
   * 注册格式化器
   * @param {string} type - 格式化器类型标识
   * @param {Class} FormatterClass - 格式化器类
   */
  register(type, FormatterClass) {
    this.formatters.set(type, FormatterClass)
    return this
  }

  /**
   * 创建格式化器实例
   * @param {string} type - 格式化器类型
   * @param {object} options - 格式化器选项
   * @returns {BaseFormatter} 格式化器实例
   */
  create(type = this.defaultFormatterType, options = {}) {
    const FormatterClass = this.formatters.get(type)

    if (!FormatterClass) {
      console.warn(`Formatter type "${type}" not found, using default "${this.defaultFormatterType}"`)
      return this.create(this.defaultFormatterType, options)
    }

    return new FormatterClass(options)
  }

  /**
   * 获取所有已注册的格式化器类型
   */
  getAvailableTypes() {
    return Array.from(this.formatters.keys())
  }

  /**
   * 设置默认格式化器类型
   */
  setDefault(type) {
    if (this.formatters.has(type)) {
      this.defaultFormatterType = type
    }
    else {
      console.warn(`Cannot set default formatter: type "${type}" not found`)
    }
    return this
  }
}

// 导出单例
const formatterManager = new FormatterManager()

// 导出格式化器类供外部扩展
export { FormatterManager, TimelineFormatter }

export default formatterManager
