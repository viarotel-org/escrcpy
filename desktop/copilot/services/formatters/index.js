/**
 * Formatter Manager
 * Provides formatter registration, retrieval, and switching capabilities
 */
import TimelineFormatter from './presets/timeline.js'

class FormatterManager {
  constructor() {
    this.formatters = new Map()
    this.defaultFormatterType = 'timeline'

    // Register built-in formatters
    this.register('timeline', TimelineFormatter)
  }

  /**
   * Register a formatter
   * @param {string} type - Formatter type identifier
   * @param {Class} FormatterClass - Formatter class
   */
  register(type, FormatterClass) {
    this.formatters.set(type, FormatterClass)
    return this
  }

  /**
   * Create a formatter instance
   * @param {string} type - Formatter type
   * @param {object} options - Formatter options
   * @returns {BaseFormatter} Formatter instance
   */
  create(type = this.defaultFormatterType, options = {}) {
    const FormatterClass = this.formatters.get(type)

    if (!FormatterClass) {
      console.warn(
        `Formatter type "${type}" not found, using default "${this.defaultFormatterType}"`,
      )
      return this.create(this.defaultFormatterType, options)
    }

    return new FormatterClass(options)
  }

  /**
   * Get all registered formatter types
   */
  getAvailableTypes() {
    return Array.from(this.formatters.keys())
  }

  /**
   * Set the default formatter type
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

// Export singleton
const formatterManager = new FormatterManager()

// Export formatter classes for external extension
export { FormatterManager, TimelineFormatter }

export default formatterManager
