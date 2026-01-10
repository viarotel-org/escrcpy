/**
 * Data validation and error handling utilities
 *
 * Design:
 * 1. Unified data validation logic
 * 2. Standardized error types and formats
 * 3. Provide defaults and fallback logic
 *
 * @module storage/utils/validation
 */

/**
 * Storage error types enum
 */
export const StorageErrorTypes = {
  /** Data validation failed */
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  /** Failed to read data */
  READ_ERROR: 'READ_ERROR',
  /** Failed to write data */
  WRITE_ERROR: 'WRITE_ERROR',
  /** Record not found */
  NOT_FOUND: 'NOT_FOUND',
  /** Database connection error */
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  /** Unknown error */
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
}

/**
 * Create a standardized storage error object
 * @param {string} type - Error type
 * @param {string} message - Error message
 * @param {any} [details] - Details
 * @returns {{type: string, message: string, details?: any, timestamp: number}}
 */
export function createStorageError(type, message, details = null) {
  return {
    type: type || StorageErrorTypes.UNKNOWN_ERROR,
    message: message || 'Unknown error occurred',
    details,
    timestamp: Date.now(),
  }
}

/**
 * Field types definitions
 */
export const FieldTypes = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  ARRAY: 'array',
  OBJECT: 'object',
  ANY: 'any',
}

/**
 * Validate a single field
 * @param {any} value - Field value
 * @param {string} fieldName - Field name
 * @param {Object} rules - Validation rules
 * @returns {{valid: boolean, error?: string}}
 */
export function validateField(value, fieldName, rules = {}) {
  // Check requiredk requiredk required
  if (rules.required && (value === undefined || value === null || value === '')) {
    return {
      valid: false,
      error: `Field '${fieldName}' is required`,
    }
  }

  // If value is empty and not required, skip other checks
  if (value === undefined || value === null) {
    return { valid: true }
  }

  // Type validation
  if (rules.type && rules.type !== FieldTypes.ANY) {
    const actualType = Array.isArray(value) ? 'array' : typeof value

    if (rules.type !== actualType) {
      return {
        valid: false,
        error: `Field '${fieldName}' expects ${rules.type}, got ${actualType}`,
      }
    }
  }

  // String minimum length
  if (rules.minLength !== undefined && typeof value === 'string') {
    if (value.length < rules.minLength) {
      return {
        valid: false,
        error: `Field '${fieldName}' must be at least ${rules.minLength} characters`,
      }
    }
  }

  // String maximum length
  if (rules.maxLength !== undefined && typeof value === 'string') {
    if (value.length > rules.maxLength) {
      return {
        valid: false,
        error: `Field '${fieldName}' must be at most ${rules.maxLength} characters`,
      }
    }
  }

  // Numeric minimum value
  if (rules.min !== undefined && typeof value === 'number') {
    if (value < rules.min) {
      return {
        valid: false,
        error: `Field '${fieldName}' must be at least ${rules.min}`,
      }
    }
  }

  // Numeric maximum value
  if (rules.max !== undefined && typeof value === 'number') {
    if (value > rules.max) {
      return {
        valid: false,
        error: `Field '${fieldName}' must be at most ${rules.max}`,
      }
    }
  }

  // Enum value validation
  if (rules.enum && Array.isArray(rules.enum)) {
    if (!rules.enum.includes(value)) {
      return {
        valid: false,
        error: `Field '${fieldName}' must be one of: ${rules.enum.join(', ')}`,
      }
    }
  }

  // Regex validation
  if (rules.pattern && typeof value === 'string') {
    if (!rules.pattern.test(value)) {
      return {
        valid: false,
        error: `Field '${fieldName}' format is invalid`,
      }
    }
  }

  // Custom validator function
  if (rules.validator && typeof rules.validator === 'function') {
    const result = rules.validator(value)
    if (result !== true) {
      return {
        valid: false,
        error: typeof result === 'string' ? result : `Field '${fieldName}' validation failed`,
      }
    }
  }

  return { valid: true }
}

/**
 * Validate data object
 * @param {Object} data - Data to validate
 * @param {Array<string>} requiredFields - List of required fields
 * @param {Object} schema - Field rule definitions
 * @returns {{valid: boolean, message?: string, errors?: Array<string>}}
 */
export function validateData(data, requiredFields = [], schema = {}) {
  const errors = []

  // Check data type
  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      message: 'Data must be a non-null object',
      errors: ['Data must be a non-null object'],
    }
  }

  // Check required fields
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`Field '${field}' is required`)
    }
  }

  // Validate each field according to schema
  for (const [fieldName, rules] of Object.entries(schema)) {
    const result = validateField(data[fieldName], fieldName, rules)
    if (!result.valid) {
      errors.push(result.error)
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      message: errors[0], // Return the first error as primary messagerst error as primary message
      errors,
    }
  }

  return { valid: true }
}

/**
 * Safely get nested object property
 * @param {Object} obj - Object
 * @param {string} path - Property path (e.g., 'a.b.c')
 * @param {any} defaultValue - Default value
 * @returns {any}
 */
export function getNestedValue(obj, path, defaultValue = undefined) {
  if (!obj || !path) {
    return defaultValue
  }

  const keys = path.split('.')
  let result = obj

  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue
    }
    result = result[key]
  }

  return result !== undefined ? result : defaultValue
}

/**
 * Generate unique ID
 * @param {string} [prefix] - ID prefix
 * @returns {string}
 */
export function generateId(prefix = '') {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 10)
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`
}

/**
 * Deep clone object (simple implementation, handles common cases)
 * @param {any} obj - Object to clone
 * @returns {any}
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item))
  }

  const cloned = {}
  for (const key of Object.keys(obj)) {
    cloned[key] = deepClone(obj[key])
  }
  return cloned
}

export default {
  StorageErrorTypes,
  createStorageError,
  FieldTypes,
  validateField,
  validateData,
  getNestedValue,
  generateId,
  deepClone,
}
