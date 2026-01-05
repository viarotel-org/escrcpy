/**
 * IPCX Payload 验证模块
 * 提供类型守卫和 envelope 规范化逻辑
 */

import type { FunctionDescriptor, InvokeEnvelope } from './types'
import { IpcxErrorCode, createPayloadError } from './errors'
import { parsePath } from './paths'
import { debugLogger } from './debug'

/**
 * 类型守卫：判断是否为 InvokeEnvelope
 */
export function isInvokeEnvelope(payload: unknown): payload is InvokeEnvelope {
  if (!payload || typeof payload !== 'object') return false
  
  const envelope = payload as Partial<InvokeEnvelope>
  return Array.isArray(envelope.args) && Array.isArray(envelope.fns)
}

/**
 * 验证并规范化 FunctionDescriptor
 */
export function normalizeDescriptor(descriptor: FunctionDescriptor): FunctionDescriptor {
  // 解析 index 路径
  const parsed = parsePath(descriptor.index)
  
  // 移除开头的 'args' 前缀（如果存在）
  const trimmed = parsed[0] === 'args' ? parsed.slice(1) : parsed
  
  // 优先使用 descriptor.segments，fallback 到解析后的路径
  const segments = descriptor.segments?.length ? descriptor.segments : trimmed
  
  return {
    label: descriptor.label,
    index: descriptor.index,
    channel: descriptor.channel,
    segments,
  }
}

/**
 * 验证并规范化 InvokeEnvelope
 * @throws {IpcxError} 当 payload 格式不合法时
 */
export function normalizeEnvelope(
  payload: unknown,
  channel?: string,
): InvokeEnvelope {
  // 验证 payload 基本结构
  if (!payload || typeof payload !== 'object') {
    throw createPayloadError(
      'Invalid IPCX payload: expected object',
      channel,
      payload,
    )
  }
  
  const envelope = payload as Partial<InvokeEnvelope>
  
  // 验证 args 字段
  if (!Array.isArray(envelope.args)) {
    throw createPayloadError(
      `Invalid IPCX payload: args must be an array, got ${typeof envelope.args}`,
      channel,
      payload,
    )
  }
  
  // 验证 fns 字段
  if (!Array.isArray(envelope.fns)) {
    throw createPayloadError(
      `Invalid IPCX payload: fns must be an array, got ${typeof envelope.fns}`,
      channel,
      payload,
    )
  }
  
  // 规范化所有 function descriptors
  const fns = envelope.fns.map((descriptor, index) => {
    try {
      return normalizeDescriptor(descriptor)
    }
    catch (error) {
      const err = createPayloadError(
        `Invalid function descriptor at index ${index}`,
        channel,
        descriptor,
      )
      err.code = IpcxErrorCode.INVALID_DESCRIPTOR
      throw err
    }
  })
  
  debugLogger.debug('Envelope normalized', {
    channel,
    argsCount: envelope.args.length,
    fnsCount: fns.length,
  })
  
  return { args: envelope.args, fns }
}

/**
 * 安全验证 envelope（不抛出异常，返回验证结果）
 */
export function validateEnvelope(
  payload: unknown,
  channel?: string,
): { valid: true; envelope: InvokeEnvelope } | { valid: false; error: Error } {
  try {
    const envelope = normalizeEnvelope(payload, channel)
    return { valid: true, envelope }
  }
  catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error : new Error(String(error)),
    }
  }
}

/**
 * 验证参数数组（用于序列化前检查）
 */
export function validateArgs(args: unknown): args is unknown[] {
  return Array.isArray(args)
}

/**
 * 准备入站参数（支持 IPCX envelope 和原生格式）
 */
export function prepareInboundArgs(
  payload: unknown,
  restArgs: unknown[],
): unknown[] {
  // 如果是 IPCX envelope，提取 args
  if (isInvokeEnvelope(payload)) {
    return payload.args
  }
  
  // 如果 payload 是 undefined，返回剩余参数
  if (typeof payload === 'undefined') {
    return restArgs
  }
  
  // 否则将 payload 作为第一个参数
  return [payload, ...restArgs]
}
