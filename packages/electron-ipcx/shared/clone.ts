function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (Object.prototype.toString.call(value) !== '[object Object]')
    return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === null || prototype === Object.prototype
}

export function clonePayload<T>(value: T, seen: WeakMap<object, unknown> = new WeakMap()): T {
  if (value === null || typeof value !== 'object')
    return value
  if (seen.has(value as object))
    return seen.get(value as object) as T
  if (Array.isArray(value)) {
    const clone: unknown[] = []
    seen.set(value, clone)
    value.forEach((entry, index) => {
      clone[index] = clonePayload(entry, seen)
    })
    return clone as T
  }
  if (isPlainObject(value)) {
    const clone: Record<string, unknown> = {}
    seen.set(value, clone)
    Object.entries(value).forEach(([key, entry]) => {
      clone[key] = clonePayload(entry, seen)
    })
    return clone as T
  }
  return value
}
