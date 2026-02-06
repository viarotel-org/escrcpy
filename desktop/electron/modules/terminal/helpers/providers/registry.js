/**
 * Terminal Provider Registry
 * Manages registration and lookup of all terminal provider types
 */

export class ProviderRegistry {
  constructor() {
    /** @type {Map<string, typeof import('./base.js').BaseTerminalProvider>} */
    this.providers = new Map()
  }

  /**
   * Register a provider
   * @param {string} type - Terminal type (e.g., 'device', 'local')
   * @param {typeof import('./base.js').BaseTerminalProvider} ProviderClass - Provider class
   */
  register(type, ProviderClass) {
    if (this.providers.has(type)) {
      console.warn(`[ProviderRegistry] Type "${type}" already registered, overwriting`)
    }
    this.providers.set(type, ProviderClass)
  }

  /**
   * Get a provider class
   * @param {string} type - Terminal type
   * @returns {typeof import('./base.js').BaseTerminalProvider}
   */
  get(type) {
    const ProviderClass = this.providers.get(type)
    if (!ProviderClass) {
      throw new Error(`[ProviderRegistry] Unknown terminal type: "${type}"`)
    }
    return ProviderClass
  }

  /**
   * Check if a type is registered
   * @param {string} type - Terminal type
   * @returns {boolean}
   */
  has(type) {
    return this.providers.has(type)
  }

  /**
   * Get all registered types
   * @returns {string[]}
   */
  getTypes() {
    return Array.from(this.providers.keys())
  }
}

// Global singleton
export const registry = new ProviderRegistry()
