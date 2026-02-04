/**
 * Preflight Checker - preflight check system
 *
 * Responsibilities:
 * 1. Perform three-layer checks before running AI tasks:
 *    - Layer 1: ADB keyboard check (with guided auto-install)
 *    - Layer 2: API service validity check
 *    - Layer 3: Subscription status check
 * 2. Provide user-friendly messages and suggested actions
 * 3. Support asynchronous checks and result caching
 *
 * @module PreflightChecker
 */

/**
 * Check result status enumeration
 */
export const CheckStatus = {
  /** Check passed */
  PASS: 'PASS',
  /** Warning (can continue, but fix recommended) */
  WARN: 'WARN',
  /** Check failed (must fix to proceed) */
  FAIL: 'FAIL',
  /** Check skipped */
  SKIP: 'SKIP',
}

/**
 * Subscription status enumeration
 */
export const SubscriptionStatus = {
  /** Active */
  ACTIVE: 'ACTIVE',
  /** Expired */
  EXPIRED: 'EXPIRED',
  /** Quota exhausted */
  EXHAUSTED: 'EXHAUSTED',
  /** Not purchased */
  NOT_PURCHASED: 'NOT_PURCHASED',
}

/**
 * @typedef {Object} CheckResult
 * @property {string} status - Check status (PASS | WARN | FAIL | SKIP)
 * @property {string} name - Name of the check
 * @property {string} [message] - User-facing message or hint
 * @property {Object} [details] - Additional details
 * @property {string} [actionType] - Suggested action type ('install' | 'configure' | 'subscribe' | 'none')
 * @property {Function} [action] - Optional auto-fix action
 */

/**
 * @typedef {Object} PreflightCheckOptions
 * @property {string} deviceId - Device ID
 * @property {Object} copilotConfig - Copilot configuration
 * @property {Object} [subscribeStore] - Subscription store (optional, used for subscription checks)
 * @property {boolean} [skipKeyboardCheck=false] - Skip ADB keyboard check
 * @property {boolean} [skipApiCheck=false] - Skip API service check
 * @property {boolean} [skipSubscriptionCheck=false] - Skip subscription status check
 */

/**
 * Preflight Checker class
 */
export class PreflightChecker {
  constructor() {
    /** Cache for check results */
    this.cache = new Map()

    /** Cache expiry time (ms) */
    this.cacheExpiry = 500
  }

  /**
   * Run all preflight checks
   *
   * @param {PreflightCheckOptions} options - Check options
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

    // Layer 1: ADB keyboard check
    if (!skipKeyboardCheck) {
      const keyboardResult = await this.checkADBKeyboard(deviceId)
      results.push(keyboardResult)
    }

    // Layer 2: API service check
    if (!skipApiCheck) {
      const apiResult = await this.checkAPIService(copilotConfig)
      results.push(apiResult)
    }

    // Layer 3: subscription status check
    if (!skipSubscriptionCheck && subscribeStore) {
      const subscriptionResult = await this.checkSubscription(copilotConfig, subscribeStore)
      results.push(subscriptionResult)
    }

    // Collect failed checks
    const failedChecks = results.filter(r => r.status === CheckStatus.FAIL)

    return {
      passed: failedChecks.length === 0,
      results,
      failedChecks,
    }
  }

  /**
   * Layer 1: Check ADB keyboard
   *
   * @param {string} deviceId - Device ID
   * @returns {Promise<CheckResult>}
   */
  async checkADBKeyboard(deviceId) {
    const cacheKey = `keyboard-${deviceId}`

    // Check cache
    if (this._isCacheValid(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      return cached.result
    }

    try {
      // Check keyboard status via IPC call to main process
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

      // Cache result
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
   * Layer 2: API service check
   *
   * @param {Object} copilotConfig - Copilot configuration
   * @returns {Promise<CheckResult>}
   */
  async checkAPIService(copilotConfig) {
    const { baseUrl, apiKey, model } = copilotConfig

    // Basic configuration validation
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

    // Check cache
    if (this._isCacheValid(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      return cached.result
    }

    try {
      // Check API validity via IPC call to main process
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

      // Cache result
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
   * Layer 3: subscription status check
   *
   * @param {Object} copilotConfig - Copilot configuration
   * @param {Object} subscribeStore - Subscription store
   * @returns {Promise<CheckResult>}
   */
  async checkSubscription(copilotConfig, subscribeStore) {
    const { apiKey } = copilotConfig

    // Determine whether using built-in subscription service
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

    // Check subscription status
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
   * Clear all cached check results
   */
  clearCache() {
    this.cache.clear()
  }

  /**
   * Clear keyboard check cache for a specific device
   *
   * @param {string} deviceId - Device ID
   */
  clearKeyboardCache(deviceId) {
    const cacheKey = `keyboard-${deviceId}`
    this.cache.delete(cacheKey)
  }

  /**
   * Check whether cache entry is still valid
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
   * Cache the check result
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
 * Export singleton
 */
export const preflightChecker = new PreflightChecker()

/**
 * Export helper function
 */
export async function runPreflightChecks(options) {
  return preflightChecker.runAll(options)
}
