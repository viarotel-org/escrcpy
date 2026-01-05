/**
 * Preflight Checker - 前置检查系统
 *
 * 职责：
 * 1. 执行 AI 任务前的三层检查
 *    - Layer 1: ADB 键盘检查（自动安装引导）
 *    - Layer 2: API 服务有效性检查
 *    - Layer 3: 订阅状态检查
 * 2. 提供友好的用户提示信息
 * 3. 支持异步检查和结果缓存
 *
 * @module PreflightChecker
 */

/**
 * 检查结果状态枚举
 */
export const CheckStatus = {
  /** 检查通过 */
  PASS: 'PASS',
  /** 检查警告（可继续，但建议修复） */
  WARN: 'WARN',
  /** 检查失败（必须修复才能继续） */
  FAIL: 'FAIL',
  /** 跳过检查 */
  SKIP: 'SKIP',
}

/**
 * 订阅状态枚举
 */
export const SubscriptionStatus = {
  /** 已激活 */
  ACTIVE: 'ACTIVE',
  /** 已过期 */
  EXPIRED: 'EXPIRED',
  /** 额度已用尽 */
  EXHAUSTED: 'EXHAUSTED',
  /** 未购买 */
  NOT_PURCHASED: 'NOT_PURCHASED',
}

/**
 * @typedef {Object} CheckResult
 * @property {string} status - 检查状态（PASS | WARN | FAIL | SKIP）
 * @property {string} name - 检查项名称
 * @property {string} [message] - 提示信息
 * @property {Object} [details] - 详细信息
 * @property {string} [actionType] - 建议的操作类型（'install' | 'configure' | 'subscribe' | 'none'）
 * @property {Function} [action] - 自动修复操作（可选）
 */

/**
 * @typedef {Object} PreflightCheckOptions
 * @property {string} deviceId - 设备 ID
 * @property {Object} copilotConfig - Copilot 配置
 * @property {Object} [subscribeStore] - 订阅 Store（可选，用于检查订阅状态）
 * @property {boolean} [skipKeyboardCheck=false] - 跳过键盘检查
 * @property {boolean} [skipApiCheck=false] - 跳过 API 检查
 * @property {boolean} [skipSubscriptionCheck=false] - 跳过订阅检查
 */

/**
 * Preflight Checker 类
 */
export class PreflightChecker {
  constructor() {
    /** 检查结果缓存 */
    this.cache = new Map()

    /** 缓存过期时间 */
    this.cacheExpiry = 500
  }

  /**
   * 运行所有前置检查
   *
   * @param {PreflightCheckOptions} options - 检查选项
   * @returns {Promise<{passed: boolean, results: CheckResult[], failedChecks: CheckResult[]}>}
   */
  async runAll(options) {
    const {
      deviceId,
      copilotConfig,
      subscribeStore,
      skipKeyboardCheck = false,
      skipApiCheck = false,
      skipSubscriptionCheck = false,
    } = options

    const results = []

    // Layer 1: ADB 键盘检查
    if (!skipKeyboardCheck) {
      const keyboardResult = await this.checkADBKeyboard(deviceId)
      results.push(keyboardResult)
    }

    // Layer 2: API 服务检查
    if (!skipApiCheck) {
      const apiResult = await this.checkAPIService(copilotConfig)
      results.push(apiResult)
    }

    // Layer 3: 订阅状态检查
    if (!skipSubscriptionCheck && subscribeStore) {
      const subscriptionResult = await this.checkSubscription(copilotConfig, subscribeStore)
      results.push(subscriptionResult)
    }

    // 统计失败的检查
    const failedChecks = results.filter(r => r.status === CheckStatus.FAIL)

    return {
      passed: failedChecks.length === 0,
      results,
      failedChecks,
    }
  }

  /**
   * Layer 1: 检查 ADB 键盘
   *
   * @param {string} deviceId - 设备 ID
   * @returns {Promise<CheckResult>}
   */
  async checkADBKeyboard(deviceId) {
    const cacheKey = `keyboard-${deviceId}`

    // 检查缓存
    if (this._isCacheValid(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      return cached.result
    }

    try {
      // 通过 IPC 调用主进程检查键盘状态
      const isInstalled = await window.electron?.ipcRenderer.invoke(
        'copilot:checkKeyboard',
        deviceId,
      )

      const result = {
        name: window.t('copilot.check.adb.name'),
        status: isInstalled ? CheckStatus.PASS : CheckStatus.FAIL,
        message: isInstalled
          ? window.t('copilot.check.adb.installed')
          : window.t('copilot.check.adb.notInstalled'),
        actionType: isInstalled ? 'none' : 'install',
        details: { deviceId, installed: isInstalled },
      }

      // 缓存结果
      this._cacheResult(cacheKey, result)

      return result
    }
    catch (error) {
      return {
        name: window.t('copilot.check.adb.name'),
        status: CheckStatus.FAIL,
        message: window.t('copilot.check.adb.checkError', { error: error.message }),
        actionType: 'none',
        details: { error: error.message },
      }
    }
  }

  /**
   * Layer 2: 检查 API 服务
   *
   * @param {Object} copilotConfig - Copilot 配置
   * @returns {Promise<CheckResult>}
   */
  async checkAPIService(copilotConfig) {
    const { baseUrl, apiKey, model } = copilotConfig

    // 基础配置校验
    if (!baseUrl || !apiKey) {
      return {
        name: window.t('copilot.check.api.name'),
        status: CheckStatus.FAIL,
        message: window.t('copilot.check.api.configIncomplete'),
        actionType: 'configure',
        details: { baseUrl, apiKey: apiKey ? '***' : null },
      }
    }

    const cacheKey = `api-${baseUrl}-${apiKey.slice(0, 8)}`

    // 检查缓存
    if (this._isCacheValid(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      return cached.result
    }

    try {
      // 通过 IPC 调用主进程检查 API 有效性
      const apiStatus = await window.electron?.ipcRenderer.invoke(
        'copilot:checkModelApi',
        { baseUrl, apiKey, model },
      )

      const result = {
        name: window.t('copilot.check.api.name'),
        status: apiStatus.success ? CheckStatus.PASS : CheckStatus.FAIL,
        message: apiStatus.success
          ? window.t('copilot.check.api.success', { model })
          : window.t('copilot.check.api.failure', { message: apiStatus.message || window.t('copilot.check.api.unknownError') }),
        actionType: apiStatus.success ? 'none' : 'configure',
        details: {
          baseUrl,
          model,
          ...apiStatus,
        },
      }

      // 缓存结果
      if (apiStatus.success) {
        this._cacheResult(cacheKey, result)
      }

      return result
    }
    catch (error) {
      return {
        name: window.t('copilot.check.api.name'),
        status: CheckStatus.FAIL,
        message: window.t('copilot.check.api.checkError', { error: error.message }),
        actionType: 'configure',
        details: { error: error.message },
      }
    }
  }

  /**
   * Layer 3: 检查订阅状态
   *
   * @param {Object} copilotConfig - Copilot 配置
   * @param {Object} subscribeStore - 订阅 Store
   * @returns {Promise<CheckResult>}
   */
  async checkSubscription(copilotConfig, subscribeStore) {
    const { apiKey } = copilotConfig

    // 判断是否使用内置订阅服务
    const isUsingBuiltinSubscription = apiKey === subscribeStore.accessToken

    if (!isUsingBuiltinSubscription) {
      return {
        name: window.t('copilot.check.subscription.name'),
        status: CheckStatus.SKIP,
        message: window.t('copilot.check.subscription.customKeySkipped'),
        actionType: 'none',
        details: { usingBuiltin: false },
      }
    }

    // 检查订阅状态
    const purchaseStatus = subscribeStore.userInfo?.purchase_status || SubscriptionStatus.NOT_PURCHASED

    const statusMessages = {
      [SubscriptionStatus.ACTIVE]: {
        status: CheckStatus.PASS,
        message: window.t('copilot.check.subscription.active'),
        actionType: 'none',
      },
      [SubscriptionStatus.EXPIRED]: {
        status: CheckStatus.FAIL,
        message: window.t('copilot.check.subscription.expired'),
        actionType: 'subscribe',
      },
      [SubscriptionStatus.EXHAUSTED]: {
        status: CheckStatus.FAIL,
        message: window.t('copilot.check.subscription.exhausted'),
        actionType: 'subscribe',
      },
      [SubscriptionStatus.NOT_PURCHASED]: {
        status: CheckStatus.FAIL,
        message: window.t('copilot.check.subscription.notPurchased'),
        actionType: 'subscribe',
      },
    }

    const statusInfo = statusMessages[purchaseStatus] || statusMessages[SubscriptionStatus.NOT_PURCHASED]

    return {
      name: window.t('copilot.check.subscription.name'),
      ...statusInfo,
      details: {
        usingBuiltin: true,
        purchaseStatus,
        userInfo: subscribeStore.userInfo,
      },
    }
  }

  /**
   * 清除所有缓存
   */
  clearCache() {
    this.cache.clear()
  }

  /**
   * 清除特定设备的键盘检查缓存
   *
   * @param {string} deviceId - 设备 ID
   */
  clearKeyboardCache(deviceId) {
    const cacheKey = `keyboard-${deviceId}`
    this.cache.delete(cacheKey)
  }

  /**
   * 检查缓存是否有效
   * @private
   */
  _isCacheValid(key) {
    if (!this.cache.has(key))
      return false

    const cached = this.cache.get(key)
    const now = Date.now()

    return now - cached.timestamp < this.cacheExpiry
  }

  /**
   * 缓存检查结果
   * @private
   */
  _cacheResult(key, result) {
    this.cache.set(key, {
      result,
      timestamp: Date.now(),
    })
  }
}

/**
 * 导出单例
 */
export const preflightChecker = new PreflightChecker()

/**
 * 导出便捷函数
 */
export async function runPreflightChecks(options) {
  return preflightChecker.runAll(options)
}
