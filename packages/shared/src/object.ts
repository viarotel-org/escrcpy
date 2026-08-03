export function deepToRaw<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}
export function toPlainValue(value: unknown): unknown {
  if (Array.isArray(value))
    return value.map(toPlainValue)
  if (!value || typeof value !== 'object')
    return value
  return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, toPlainValue(nested)]))
}
export function clonePlainValue<T>(value: T): T {
  return toPlainValue(value) as T
}
