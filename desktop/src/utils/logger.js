/**
 * Centralized logging utility
 * Uses electron-log for consistent logging across main and renderer processes
 *
 * Design:
 * 1. Single instance for consistent configuration
 * 2. Log levels for filtering (debug, info, warn, error)
 * 3. Automatic timestamp and source attribution
 * 4. Supports file output and console output
 *
 * @module utils/logger
 */

import log from 'electron-log'

/**
 * Log level configuration
 * @readonly
 * @enum {string}
 */
export const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
}

/**
 * Default log level for the application
 * Set to INFO in production, DEBUG in development
 */
const DEFAULT_LEVEL = import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO

/**
 * Configure the logger instance
 */
log.transports.file.level = DEFAULT_LEVEL
log.transports.console.level = import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.WARN

/**
 * Maximum log file size (5MB)
 * Old logs are rotated when size is exceeded
 */
log.transports.file.maxSize = 5 * 1024 * 1024

/**
 * Format log messages with consistent structure
 * @param {string} prefix - Module prefix for attribution
 * @param {string} level - Log level
 * @param  {...any} args - Arguments to log
 */
function formatLog(prefix, level, ...args) {
  const timestamp = new Date().toISOString()
  const formattedPrefix = prefix ? `[${prefix}]` : ''

  switch (level) {
    case LogLevel.DEBUG:
      log.debug(formattedPrefix, ...args)
      break
    case LogLevel.INFO:
      log.info(formattedPrefix, ...args)
      break
    case LogLevel.WARN:
      log.warn(formattedPrefix, ...args)
      break
    case LogLevel.ERROR:
      log.error(formattedPrefix, ...args)
      break
    default:
      log.log(formattedPrefix, ...args)
  }
}

/**
 * Create a logger instance for a specific module
 * @param {string} moduleName - Name of the module for log attribution
 * @returns {Object} Logger instance with prefixed methods
 */
export function createLogger(moduleName) {
  return {
    /**
     * Log debug message
     * @param {...any} args - Arguments to log
     */
    debug: (...args) => formatLog(moduleName, LogLevel.DEBUG, ...args),

    /**
     * Log info message
     * @param {...any} args - Arguments to log
     */
    info: (...args) => formatLog(moduleName, LogLevel.INFO, ...args),

    /**
     * Log warning message
     * @param {...any} args - Arguments to log
     */
    warn: (...args) => formatLog(moduleName, LogLevel.WARN, ...args),

    /**
     * Log error message
     * @param {...any} args - Arguments to log
     */
    error: (...args) => formatLog(moduleName, LogLevel.ERROR, ...args),
  }
}

/**
 * Global logger instance for general use
 */
export const logger = createLogger('App')

export default logger
