/**
 * IPCX payload validation module
 * Provides type guards and envelope normalization logic
 */

import type { FunctionDescriptor, InvokeEnvelope } from './types'
import { IpcxErrorCode, createPayloadError } from './errors'
import { parsePath } from './paths'
import { debugLogger } from './debug'

/**
 * Type guard: determines if a payload is an InvokeEnvelope
 */
export function isInvokeEnvelope(payload: unknown): payload is InvokeEnvelope {
  if (!payload || typeof payload !== 'object') return false
  
  const envelope = payload as Partial<InvokeEnvelope>
  return Array.isArray(envelope.args) && Array.isArray(envelope.fns)
}

/**
 * Validate and normalize FunctionDescriptor
 */
export function normalizeDescriptor(descriptor: FunctionDescriptor): FunctionDescriptor {
  // Parse the index path
  const parsed = parsePath(descriptor.index)
  
  // Remove leading 'args' prefix if present
  const trimmed = parsed[0] === 'args' ? parsed.slice(1) : parsed
  
  // Prefer descriptor.segments; fall back to parsed path
  const segments = descriptor.segments?.length ? descriptor.segments : trimmed
  
  return {
    label: descriptor.label,
    index: descriptor.index,
    channel: descriptor.channel,
    segments,
  }
}

/**
 * Validate and normalize an InvokeEnvelope
 * @throws {IpcxError} When the payload format is invalid
 */
export function normalizeEnvelope(
  payload: unknown,
  channel?: string,
): InvokeEnvelope {
  // Validate basic payload structure
  if (!payload || typeof payload !== 'object') {
    throw createPayloadError(
      'Invalid IPCX payload: expected object',
      channel,
      payload,
    )
  }
  
  const envelope = payload as Partial<InvokeEnvelope>
  
  // Validate args field
  if (!Array.isArray(envelope.args)) {
    throw createPayloadError(
      `Invalid IPCX payload: args must be an array, got ${typeof envelope.args}`,
      channel,
      payload,
    )
  }
  
  // Validate fns field
  if (!Array.isArray(envelope.fns)) {
    throw createPayloadError(
      `Invalid IPCX payload: fns must be an array, got ${typeof envelope.fns}`,
      channel,
      payload,
    )
  }
  
  // Normalize all function descriptors
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
 * Safely validate an envelope (returns result instead of throwing)
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
 * Validate argument arrays (used for pre-serialization checks)
 */
export function validateArgs(args: unknown): args is unknown[] {
  return Array.isArray(args)
}

/**
 * Prepare inbound arguments (supports IPCX envelope and native formats)
 */
export function prepareInboundArgs(
  payload: unknown,
  restArgs: unknown[],
): unknown[] {
  // If an IPCX envelope is provided, extract its args
  if (isInvokeEnvelope(payload)) {
    return payload.args
  }
  
  // If payload is undefined, return the remaining arguments
  if (typeof payload === 'undefined') {
    return restArgs
  }
  
  // Otherwise treat payload as the first argument
  return [payload, ...restArgs]
}
