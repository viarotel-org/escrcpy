/**
 * Terminal Provider Registry
 * 管理所有终端类型的 Provider 注册和查找
 */

export class ProviderRegistry {
  constructor() {
    /** @type {Map<string, typeof import('./base.js').BaseTerminalProvider>} */
    this.providers = new Map()
  }

  /**
   * 注册 Provider
   * @param {string} type - 终端类型（如 'device', 'local'）
   * @param {typeof import('./base.js').BaseTerminalProvider} ProviderClass - Provider 类
   */
  register(type, ProviderClass) {
    if (this.providers.has(type)) {
      console.warn(`[ProviderRegistry] Type "${type}" already registered, overwriting`)
    }
    this.providers.set(type, ProviderClass)
  }

  /**
   * 获取 Provider 类
   * @param {string} type - 终端类型
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
   * 检查类型是否已注册
   * @param {string} type - 终端类型
   * @returns {boolean}
   */
  has(type) {
    return this.providers.has(type)
  }

  /**
   * 获取所有已注册的类型
   * @returns {string[]}
   */
  getTypes() {
    return Array.from(this.providers.keys())
  }
}

// 全局单例
export const registry = new ProviderRegistry()
