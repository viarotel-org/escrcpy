/**
 * IPCX debugging utilities
 * Provides configurable debug logging controlled via environment variables
 */

export enum LogLevel {
  NONE = 0,
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEBUG = 4,
}

export interface DebugContext {
  channel?: string
  direction?: 'send' | 'receive'
  payload?: unknown
  args?: unknown[]
  error?: unknown
  [key: string]: unknown
}

class DebugLogger {
  private level: LogLevel

  constructor() {
    this.level = this.parseLogLevel(process.env.IPCX_DEBUG)
  }

  private parseLogLevel(value: string | undefined): LogLevel {
    if (!value) return LogLevel.NONE
    
    const normalized = value.toUpperCase()
    if (normalized === 'TRUE' || normalized === '1') return LogLevel.INFO
    if (normalized in LogLevel) return LogLevel[normalized as keyof typeof LogLevel]
    
    return LogLevel.NONE
  }

  setLevel(level: LogLevel) {
    this.level = level
  }

  getLevel(): LogLevel {
    return this.level
  }

  private shouldLog(level: LogLevel): boolean {
    return this.level >= level
  }

  private formatMessage(prefix: string, message: string, context?: DebugContext): string {
    let output = `[IPCX:${prefix}] ${message}`
    
    if (context?.channel) {
      output += ` | channel: "${context.channel}"`
    }
    
    if (context?.direction) {
      output += ` | ${context.direction}`
    }
    
    return output
  }

  private formatContext(context: DebugContext): Record<string, unknown> {
    const { channel, direction, ...rest } = context
    return rest
  }

  error(message: string, context?: DebugContext) {
    if (!this.shouldLog(LogLevel.ERROR)) return
    
    const formatted = this.formatMessage('ERROR', message, context)
    if (context) {
      console.error(formatted, this.formatContext(context))
    }
    else {
      console.error(formatted)
    }
  }

  warn(message: string, context?: DebugContext) {
    if (!this.shouldLog(LogLevel.WARN)) return
    
    const formatted = this.formatMessage('WARN', message, context)
    if (context) {
      console.warn(formatted, this.formatContext(context))
    }
    else {
      console.warn(formatted)
    }
  }

  info(message: string, context?: DebugContext) {
    if (!this.shouldLog(LogLevel.INFO)) return
    
    const formatted = this.formatMessage('INFO', message, context)
    if (context) {
      console.info(formatted, this.formatContext(context))
    }
    else {
      console.info(formatted)
    }
  }

  debug(message: string, context?: DebugContext) {
    if (!this.shouldLog(LogLevel.DEBUG)) return
    
    const formatted = this.formatMessage('DEBUG', message, context)
    if (context) {
      console.debug(formatted, this.formatContext(context))
    }
    else {
      console.debug(formatted)
    }
  }

  /**
   * Debug serialization comparison
   */
  debugSerialize(channel: string, originalArgs: unknown[], envelope: unknown) {
    if (!this.shouldLog(LogLevel.DEBUG)) return
    
    this.debug('Serialization comparison', {
      channel,
      direction: 'send',
      originalArgs,
      envelope,
    })
  }

  /**
   * Debug payload format detection
   */
  debugPayloadDetection(channel: string, payload: unknown, isIpcxFormat: boolean) {
    if (!this.shouldLog(LogLevel.DEBUG)) return
    
    this.debug('Payload format detection', {
      channel,
      direction: 'receive',
      payload: this.truncatePayload(payload),
      isIpcxFormat,
    })
  }

  /**
   * Truncate large payloads to prevent log flooding
   */
  private truncatePayload(payload: unknown): unknown {
    if (typeof payload !== 'object' || payload === null) return payload
    
    const str = JSON.stringify(payload)
    if (str.length <= 500) return payload
    
    return `${str.slice(0, 500)}... (truncated, total ${str.length} chars)`
  }
}

// Global singleton
export const debugLogger = new DebugLogger()

