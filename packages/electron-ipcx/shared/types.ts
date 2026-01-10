export interface FunctionDescriptor {
  label: string
  index: string
  segments: Array<string | number>
  channel: string
}

export interface InvokeEnvelope {
  args: unknown[]
  fns: FunctionDescriptor[]
}

export interface ErrorEnvelope {
  __ipcxError: true
  name: string
  message: string
  stack?: string
  code?: string | number
}

export interface InvokeOptions {
  /**
   * Automatically dispose generated renderer listeners after the invoke promise settles.
   * Defaults to true.
   */
  autoDispose?: boolean
}

export interface InvokeHandle<T = unknown> {
  promise: Promise<T>
  dispose: () => void
}

/**
 * @deprecated Use IpcxError from './errors' instead
 */
export class InvalidPayloadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidPayloadError'
  }
}

export type AnyFn = (...args: any[]) => any

/**
 * Debug configuration interface
 */
export interface IpcxDebugConfig {
  /**
   * Whether debug logging is enabled
   */
  enabled: boolean
  
  /**
   * Log level
   */
  level?: 'error' | 'warn' | 'info' | 'debug'
  
  /**
   * Whether to log payload details
   */
  logPayload?: boolean
  
  /**
   * Whether to log serialization comparisons
   */
  logSerialization?: boolean
}

/**
 * Performance configuration interface
 */
export interface IpcxPerformanceConfig {
  /**
   * Whether to enable channel pooling
   */
  useChannelPool?: boolean
  
  /**
   * Channel pool size
   */
  channelPoolSize?: number
  
  /**
   * Threshold for using on-demand generation based on function parameter count
   */
  directGenerateThreshold?: number
}
