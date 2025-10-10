/**
 * Enhanced error handling utilities for escrcpy
 * Provides comprehensive error management and user feedback
 */

/**
 * Custom error classes for escrcpy
 */
export class EscrcpyError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', details = {}) {
    super(message)
    this.name = 'EscrcpyError'
    this.code = code
    this.details = details
    this.timestamp = new Date().toISOString()
    this.stack = this.stack || (new Error()).stack
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack,
    }
  }
}

export class DeviceConnectionError extends EscrcpyError {
  constructor(message, deviceId = null, details = {}) {
    super(message, 'DEVICE_CONNECTION_ERROR', { deviceId, ...details })
    this.name = 'DeviceConnectionError'
  }
}

export class ScrcpyError extends EscrcpyError {
  constructor(message, command = null, details = {}) {
    super(message, 'SCRCPY_ERROR', { command, ...details })
    this.name = 'ScrcpyError'
  }
}

export class AdbError extends EscrcpyError {
  constructor(message, command = null, details = {}) {
    super(message, 'ADB_ERROR', { command, ...details })
    this.name = 'AdbError'
  }
}

export class ConfigurationError extends EscrcpyError {
  constructor(message, configKey = null, details = {}) {
    super(message, 'CONFIGURATION_ERROR', { configKey, ...details })
    this.name = 'ConfigurationError'
  }
}

export class NetworkError extends EscrcpyError {
  constructor(message, url = null, details = {}) {
    super(message, 'NETWORK_ERROR', { url, ...details })
    this.name = 'NetworkError'
  }
}

export class PermissionError extends EscrcpyError {
  constructor(message, permission = null, details = {}) {
    super(message, 'PERMISSION_ERROR', { permission, ...details })
    this.name = 'PermissionError'
  }
}

/**
 * Error handler class
 */
export class ErrorHandler {
  constructor() {
    this.errors = []
    this.maxErrors = 100
    this.listeners = new Map()
  }
  
  /**
   * Handle an error
   */
  handleError(error, context = null, severity = 'error') {
    const errorInfo = {
      error: error instanceof EscrcpyError ? error : new EscrcpyError(error.message, 'UNKNOWN_ERROR', { originalError: error }),
      context,
      severity,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }
    
    // Add to error log
    this.errors.push(errorInfo)
    
    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors)
    }
    
    // Log to console
    console.error(`[${severity.toUpperCase()}] ${context ? `[${context}] ` : ''}${error.message}`, error)
    
    // Notify listeners
    this.notifyListeners(errorInfo)
    
    // Show user notification if needed
    if (severity === 'error' || severity === 'critical') {
      this.showUserNotification(errorInfo)
    }
    
    return errorInfo
  }
  
  /**
   * Add error listener
   */
  addListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }
  
  /**
   * Remove error listener
   */
  removeListener(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }
  
  /**
   * Notify listeners
   */
  notifyListeners(errorInfo) {
    const callbacks = this.listeners.get('error') || []
    callbacks.forEach(callback => {
      try {
        callback(errorInfo)
      } catch (e) {
        console.error('Error in error listener:', e)
      }
    })
  }
  
  /**
   * Show user notification
   */
  showUserNotification(errorInfo) {
    // Try to use Element Plus notification if available
    if (window.ElNotification) {
      window.ElNotification({
        title: 'Error',
        message: errorInfo.error.message,
        type: 'error',
        duration: 5000,
        showClose: true,
      })
    } else {
      // Fallback to browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Escrcpy Error', {
          body: errorInfo.error.message,
          icon: '/favicon.ico',
        })
      }
    }
  }
  
  /**
   * Get error statistics
   */
  getErrorStats() {
    const stats = {
      total: this.errors.length,
      bySeverity: {},
      byCode: {},
      recent: this.errors.slice(-10),
    }
    
    this.errors.forEach(errorInfo => {
      // Count by severity
      stats.bySeverity[errorInfo.severity] = (stats.bySeverity[errorInfo.severity] || 0) + 1
      
      // Count by error code
      const code = errorInfo.error.code
      stats.byCode[code] = (stats.byCode[code] || 0) + 1
    })
    
    return stats
  }
  
  /**
   * Clear error log
   */
  clearErrors() {
    this.errors = []
  }
  
  /**
   * Export errors for debugging
   */
  exportErrors() {
    return {
      errors: this.errors,
      stats: this.getErrorStats(),
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Error boundary for Vue components
 */
export class VueErrorBoundary {
  constructor() {
    this.errorHandler = new ErrorHandler()
  }
  
  /**
   * Wrap a Vue component with error boundary
   */
  wrapComponent(component) {
    const originalSetup = component.setup
    const originalMounted = component.mounted
    const originalUpdated = component.updated
    const originalUnmounted = component.unmounted
    
    component.setup = (...args) => {
      try {
        return originalSetup ? originalSetup.apply(component, args) : undefined
      } catch (error) {
        this.errorHandler.handleError(error, 'Component Setup', 'error')
        throw error
      }
    }
    
    if (originalMounted) {
      component.mounted = (...args) => {
        try {
          return originalMounted.apply(component, args)
        } catch (error) {
          this.errorHandler.handleError(error, 'Component Mounted', 'error')
        }
      }
    }
    
    if (originalUpdated) {
      component.updated = (...args) => {
        try {
          return originalUpdated.apply(component, args)
        } catch (error) {
          this.errorHandler.handleError(error, 'Component Updated', 'error')
        }
      }
    }
    
    if (originalUnmounted) {
      component.unmounted = (...args) => {
        try {
          return originalUnmounted.apply(component, args)
        } catch (error) {
          this.errorHandler.handleError(error, 'Component Unmounted', 'error')
        }
      }
    }
    
    return component
  }
}

/**
 * Async error handling utilities
 */
export class AsyncErrorHandler {
  /**
   * Wrap async function with error handling
   */
  static wrapAsync(fn, context = null) {
    return async (...args) => {
      try {
        return await fn(...args)
      } catch (error) {
        globalErrorHandler.handleError(error, context, 'error')
        throw error
      }
    }
  }
  
  /**
   * Handle promise rejection
   */
  static handlePromiseRejection(promise, context = null) {
    return promise.catch(error => {
      globalErrorHandler.handleError(error, context, 'error')
      throw error
    })
  }
  
  /**
   * Retry async operation with exponential backoff
   */
  static async retryAsync(fn, maxRetries = 3, delay = 1000, context = null) {
    let lastError
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error
        
        if (attempt === maxRetries) {
          globalErrorHandler.handleError(error, context, 'error')
          throw error
        }
        
        // Exponential backoff
        const waitTime = delay * Math.pow(2, attempt - 1)
        await new Promise(resolve => setTimeout(resolve, waitTime))
        
        globalErrorHandler.handleError(error, `${context} (attempt ${attempt}/${maxRetries})`, 'warning')
      }
    }
    
    throw lastError
  }
}

/**
 * Device-specific error handling
 */
export class DeviceErrorHandler {
  /**
   * Handle device connection errors
   */
  static handleConnectionError(error, deviceId) {
    const deviceError = new DeviceConnectionError(
      `Failed to connect to device: ${error.message}`,
      deviceId,
      { originalError: error }
    )
    
    globalErrorHandler.handleError(deviceError, 'Device Connection', 'error')
    return deviceError
  }
  
  /**
   * Handle scrcpy errors
   */
  static handleScrcpyError(error, command) {
    const scrcpyError = new ScrcpyError(
      `Scrcpy command failed: ${error.message}`,
      command,
      { originalError: error }
    )
    
    globalErrorHandler.handleError(scrcpyError, 'Scrcpy', 'error')
    return scrcpyError
  }
  
  /**
   * Handle ADB errors
   */
  static handleAdbError(error, command) {
    const adbError = new AdbError(
      `ADB command failed: ${error.message}`,
      command,
      { originalError: error }
    )
    
    globalErrorHandler.handleError(adbError, 'ADB', 'error')
    return adbError
  }
}

/**
 * Network error handling
 */
export class NetworkErrorHandler {
  /**
   * Handle network errors
   */
  static handleNetworkError(error, url) {
    const networkError = new NetworkError(
      `Network request failed: ${error.message}`,
      url,
      { originalError: error }
    )
    
    globalErrorHandler.handleError(networkError, 'Network', 'error')
    return networkError
  }
  
  /**
   * Handle fetch errors with retry
   */
  static async fetchWithRetry(url, options = {}, maxRetries = 3) {
    return AsyncErrorHandler.retryAsync(
      async () => {
        const response = await fetch(url, options)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        return response
      },
      maxRetries,
      1000,
      `Network Request: ${url}`
    )
  }
}

/**
 * Configuration error handling
 */
export class ConfigurationErrorHandler {
  /**
   * Handle configuration errors
   */
  static handleConfigurationError(error, configKey) {
    const configError = new ConfigurationError(
      `Configuration error: ${error.message}`,
      configKey,
      { originalError: error }
    )
    
    globalErrorHandler.handleError(configError, 'Configuration', 'error')
    return configError
  }
  
  /**
   * Validate configuration
   */
  static validateConfiguration(config, schema) {
    try {
      // Basic validation logic
      for (const key in schema) {
        if (schema[key].required && !(key in config)) {
          throw new Error(`Missing required configuration: ${key}`)
        }
        
        if (key in config && schema[key].type) {
          const actualType = typeof config[key]
          const expectedType = schema[key].type
          
          if (actualType !== expectedType) {
            throw new Error(`Invalid type for ${key}: expected ${expectedType}, got ${actualType}`)
          }
        }
      }
      
      return true
    } catch (error) {
      this.handleConfigurationError(error, 'validation')
      return false
    }
  }
}

/**
 * Vue composable for error handling
 */
export function useErrorHandling() {
  const handleError = (error, context = null, severity = 'error') => {
    return globalErrorHandler.handleError(error, context, severity)
  }
  
  const handleAsyncError = (fn, context = null) => {
    return AsyncErrorHandler.wrapAsync(fn, context)
  }
  
  const handlePromiseRejection = (promise, context = null) => {
    return AsyncErrorHandler.handlePromiseRejection(promise, context)
  }
  
  const retryAsync = (fn, maxRetries = 3, delay = 1000, context = null) => {
    return AsyncErrorHandler.retryAsync(fn, maxRetries, delay, context)
  }
  
  const handleDeviceError = (error, deviceId) => {
    return DeviceErrorHandler.handleConnectionError(error, deviceId)
  }
  
  const handleScrcpyError = (error, command) => {
    return DeviceErrorHandler.handleScrcpyError(error, command)
  }
  
  const handleAdbError = (error, command) => {
    return DeviceErrorHandler.handleAdbError(error, command)
  }
  
  const handleNetworkError = (error, url) => {
    return NetworkErrorHandler.handleNetworkError(error, url)
  }
  
  const fetchWithRetry = (url, options = {}, maxRetries = 3) => {
    return NetworkErrorHandler.fetchWithRetry(url, options, maxRetries)
  }
  
  const handleConfigurationError = (error, configKey) => {
    return ConfigurationErrorHandler.handleConfigurationError(error, configKey)
  }
  
  const validateConfiguration = (config, schema) => {
    return ConfigurationErrorHandler.validateConfiguration(config, schema)
  }
  
  const getErrorStats = () => {
    return globalErrorHandler.getErrorStats()
  }
  
  const clearErrors = () => {
    globalErrorHandler.clearErrors()
  }
  
  const exportErrors = () => {
    return globalErrorHandler.exportErrors()
  }
  
  return {
    handleError,
    handleAsyncError,
    handlePromiseRejection,
    retryAsync,
    handleDeviceError,
    handleScrcpyError,
    handleAdbError,
    handleNetworkError,
    fetchWithRetry,
    handleConfigurationError,
    validateConfiguration,
    getErrorStats,
    clearErrors,
    exportErrors,
  }
}

// Global error handler instance
export const globalErrorHandler = new ErrorHandler()

// Global error handlers
if (typeof window !== 'undefined') {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    globalErrorHandler.handleError(event.reason, 'Unhandled Promise Rejection', 'error')
  })
  
  // Handle global errors
  window.addEventListener('error', (event) => {
    globalErrorHandler.handleError(event.error, 'Global Error', 'error')
  })
}
