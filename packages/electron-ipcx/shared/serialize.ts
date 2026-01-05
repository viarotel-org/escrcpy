import { nanoid } from 'nanoid'
import { formatPath } from './paths'
import type { FunctionDescriptor } from './types'
import { createSerializeError, IpcxErrorCode } from './errors'
import { debugLogger } from './debug'

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (Object.prototype.toString.call(value) !== '[object Object]') return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === null || prototype === Object.prototype
}

function cloneValue(
  value: unknown,
  segments: Array<string | number>,
  descriptors: FunctionDescriptor[],
  baseChannel: string,
  seen: WeakMap<object, unknown>,
  depth = 0,
): unknown {
  const MAX_DEPTH = 100
  if (depth > MAX_DEPTH) {
    const error = createSerializeError(
      'Maximum serialization depth exceeded (possible circular reference)',
      undefined,
      { segments, depth },
    )
    error.code = IpcxErrorCode.CIRCULAR_REFERENCE
    throw error
  }

  if (typeof value === 'function') {
    const label = (value as Function).name || String(segments[segments.length - 1] ?? 'fn')
    const channel = `${baseChannel}_${nanoid(8)}`
    const index = formatPath(['args', ...segments])
    
    descriptors.push({
      label,
      index,
      channel,
      segments: [...segments],
    })
    
    debugLogger.debug('Function extracted', { index, channel, label })
    
    return null
  }

  if (typeof value !== 'object' || value === null) return value

  if (seen.has(value)) {
    const cached = seen.get(value as object)
    debugLogger.warn('Circular reference detected', { segments })
    return cached
  }

  if (Array.isArray(value)) {
    const cloned: unknown[] = []
    seen.set(value, cloned)
    
    try {
      value.forEach((item, idx) => {
        cloned[idx] = cloneValue(item, [...segments, idx], descriptors, baseChannel, seen, depth + 1)
      })
    }
    catch (error) {
      throw createSerializeError(
        'Failed to serialize array',
        error,
        { segments, arrayLength: value.length },
      )
    }
    
    return cloned
  }

  if (isPlainObject(value)) {
    const cloned: Record<string, unknown> = {}
    seen.set(value, cloned)
    
    try {
      Object.entries(value).forEach(([key, entry]) => {
        cloned[key] = cloneValue(entry, [...segments, key], descriptors, baseChannel, seen, depth + 1)
      })
    }
    catch (error) {
      throw createSerializeError(
        'Failed to serialize object',
        error,
        { segments, keys: Object.keys(value) },
      )
    }
    
    return cloned
  }

  debugLogger.debug('Non-plain object encountered', {
    segments,
    type: value.constructor?.name || typeof value,
  })
  
  return value
}

export function serializeArgs(args: unknown[], baseChannel: string): {
  sanitizedArgs: unknown[]
  descriptors: FunctionDescriptor[]
} {
  if (!args || args.length === 0) {
    debugLogger.debug('Serializing empty args')
    return {
      sanitizedArgs: [],
      descriptors: [],
    }
  }

  const descriptors: FunctionDescriptor[] = []
  const seen = new WeakMap<object, unknown>()
  
  try {
    const sanitizedArgs = cloneValue(args, [], descriptors, baseChannel, seen, 0)
    
    const result = Array.isArray(sanitizedArgs) ? sanitizedArgs : [sanitizedArgs]
    
    debugLogger.debug('Serialization completed', {
      originalArgsCount: args.length,
      sanitizedArgsCount: result.length,
      functionsExtracted: descriptors.length,
    })
    
    return {
      sanitizedArgs: result,
      descriptors,
    }
  }
  catch (error) {
    if (error instanceof Error && 'code' in error) {
      throw error
    }
    
    throw createSerializeError(
      'Serialization failed',
      error,
      { argsCount: args.length },
    )
  }
}
