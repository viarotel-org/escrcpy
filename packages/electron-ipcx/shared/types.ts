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
 * 调试配置接口
 */
export interface IpcxDebugConfig {
  /**
   * 是否启用调试日志
   */
  enabled: boolean
  
  /**
   * 日志级别
   */
  level?: 'error' | 'warn' | 'info' | 'debug'
  
  /**
   * 是否记录 payload 详情
   */
  logPayload?: boolean
  
  /**
   * 是否记录序列化前后对比
   */
  logSerialization?: boolean
}

/**
 * 性能配置接口
 */
export interface IpcxPerformanceConfig {
  /**
   * 是否启用 channel 池
   */
  useChannelPool?: boolean
  
  /**
   * Channel 池大小
   */
  channelPoolSize?: number
  
  /**
   * 使用即时生成的函数参数阈值
   */
  directGenerateThreshold?: number
}
