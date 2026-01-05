/**
 * IPCX 统一错误处理模块
 * 定义错误码、错误类型和错误包装逻辑
 */

import type { ErrorEnvelope } from './types'
import { debugLogger } from './debug'

export enum IpcxErrorCode {
  // Payload 验证错误 (1xxx)
  INVALID_PAYLOAD = 'IPCX_E1001',
  INVALID_ARGS = 'IPCX_E1002',
  INVALID_FNS = 'IPCX_E1003',
  INVALID_DESCRIPTOR = 'IPCX_E1004',
  
  // 序列化错误 (2xxx)
  SERIALIZE_FAILED = 'IPCX_E2001',
  CIRCULAR_REFERENCE = 'IPCX_E2002',
  UNSUPPORTED_TYPE = 'IPCX_E2003',
  
  // 运行时错误 (3xxx)
  CALLBACK_FAILED = 'IPCX_E3001',
  SENDER_MISSING = 'IPCX_E3002',
  HYDRATION_FAILED = 'IPCX_E3003',
  LISTENER_ERROR = 'IPCX_E3004',
  
  // 系统错误 (9xxx)
  UNKNOWN = 'IPCX_E9999',
}

export class IpcxError extends Error {
  code: IpcxErrorCode
  context?: Record<string, unknown>
  
  constructor(
    code: IpcxErrorCode,
    message: string,
    context?: Record<string, unknown>,
  ) {
    super(message)
    this.name = 'IpcxError'
    this.code = code
    this.context = context
    
    // 确保 stack trace 正确
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IpcxError)
    }
  }
  
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
      stack: this.stack,
    }
  }
}

/**
 * 创建 payload 验证错误
 */
export function createPayloadError(
  message: string,
  channel?: string,
  payload?: unknown,
): IpcxError {
  const error = new IpcxError(
    IpcxErrorCode.INVALID_PAYLOAD,
    message,
    {
      channel,
      payloadType: typeof payload,
      payloadPreview: truncateValue(payload),
    },
  )
  
  debugLogger.error(message, { channel, error })
  
  return error
}

/**
 * 创建序列化错误
 */
export function createSerializeError(
  message: string,
  originalError?: unknown,
  context?: Record<string, unknown>,
): IpcxError {
  const error = new IpcxError(
    IpcxErrorCode.SERIALIZE_FAILED,
    message,
    {
      ...context,
      originalError: originalError instanceof Error ? {
        name: originalError.name,
        message: originalError.message,
      } : String(originalError),
    },
  )
  
  debugLogger.error(message, { error, ...context })
  
  return error
}

/**
 * 创建回调执行错误
 */
export function createCallbackError(
  callbackIndex: string,
  originalError: unknown,
): IpcxError {
  const error = new IpcxError(
    IpcxErrorCode.CALLBACK_FAILED,
    `Callback execution failed: ${callbackIndex}`,
    {
      callbackIndex,
      originalError: originalError instanceof Error ? {
        name: originalError.name,
        message: originalError.message,
        stack: originalError.stack,
      } : String(originalError),
    },
  )
  
  debugLogger.error(error.message, { error })
  
  return error
}

/**
 * 包装任意错误为 ErrorEnvelope（用于 IPC 传输）
 */
export function wrapError(error: unknown): ErrorEnvelope {
  let err: Error
  let code: string | number | undefined
  
  if (error instanceof IpcxError) {
    err = error
    code = error.code
  }
  else if (error instanceof Error) {
    err = error
    // @ts-expect-error 非标准属性
    code = err.code
  }
  else {
    err = new Error(String(error))
  }
  
  const envelope: ErrorEnvelope = {
    __ipcxError: true,
    name: err.name || 'Error',
    message: err.message,
    stack: err.stack,
  }
  
  if (code !== undefined) {
    envelope.code = code
  }
  
  return envelope
}

/**
 * 解包 ErrorEnvelope 并重新抛出
 */
export function unwrapError<T>(value: T | ErrorEnvelope): T {
  if (isErrorEnvelope(value)) {
    const error = new Error(value.message)
    error.name = value.name
    // @ts-expect-error 非标准属性
    if (value.code) error.code = value.code
    if (value.stack) error.stack = value.stack
    throw error
  }
  return value as T
}

/**
 * 判断是否为 ErrorEnvelope
 */
export function isErrorEnvelope(value: unknown): value is ErrorEnvelope {
  return (
    typeof value === 'object'
    && value !== null
    && '__ipcxError' in value
    && (value as ErrorEnvelope).__ipcxError === true
  )
}

/**
 * 截断值用于日志输出
 */
function truncateValue(value: unknown, maxLength = 200): string {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  
  try {
    const str = typeof value === 'object' ? JSON.stringify(value) : String(value)
    return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str
  }
  catch {
    return `[${typeof value}] (non-serializable)`
  }
}

/**
 * 安全执行函数，捕获错误但不抛出
 */
export function safeCall(fn: () => void, errorContext?: string): void {
  try {
    fn()
  }
  catch (error) {
    debugLogger.error(
      `Safe call failed${errorContext ? `: ${errorContext}` : ''}`,
      { error },
    )
  }
}
