import type { AnyFn } from './types.js'
/**
 * Expose all methods of a class instance that are functions as an object API.
 * @param Ctor 
 * @param ctorArgs 
 * @returns 
 */
export function exposeClassAPI<T extends object>(
  Ctor: new (...args: any[]) => T,
  ...ctorArgs: ConstructorParameters<typeof Ctor>
): {
  [K in keyof T as T[K] extends AnyFn ? K : never]: T[K]
} {
  const instance = new Ctor(...ctorArgs)
  const proto = Ctor.prototype
  const api: Record<string, AnyFn> = {}

  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key === 'constructor') continue
    const fn = (instance as any)[key]
    if (typeof fn === 'function') {
      api[key] = fn.bind(instance)
    }
  }

  return Object.freeze(api) as any
}