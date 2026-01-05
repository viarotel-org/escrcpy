/**
 * 数据校验与错误处理工具
 *
 * 设计思路：
 * 1. 统一的数据校验逻辑
 * 2. 标准化的错误类型和格式
 * 3. 提供默认值和兜底逻辑
 *
 * @module storage/utils/validation
 */

/**
 * 存储错误类型枚举
 */
export const StorageErrorTypes = {
  /** 数据校验失败 */
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  /** 读取数据失败 */
  READ_ERROR: 'READ_ERROR',
  /** 写入数据失败 */
  WRITE_ERROR: 'WRITE_ERROR',
  /** 记录不存在 */
  NOT_FOUND: 'NOT_FOUND',
  /** 数据库连接错误 */
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  /** 未知错误 */
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
}

/**
 * 创建标准化的存储错误对象
 * @param {string} type - 错误类型
 * @param {string} message - 错误消息
 * @param {any} [details] - 详细信息
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
 * 字段类型定义
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
 * 校验单个字段
 * @param {any} value - 字段值
 * @param {string} fieldName - 字段名
 * @param {Object} rules - 校验规则
 * @returns {{valid: boolean, error?: string}}
 */
export function validateField(value, fieldName, rules = {}) {
  // 检查必填
  if (rules.required && (value === undefined || value === null || value === '')) {
    return {
      valid: false,
      error: `Field '${fieldName}' is required`,
    }
  }

  // 如果值为空且非必填，跳过其他校验
  if (value === undefined || value === null) {
    return { valid: true }
  }

  // 类型校验
  if (rules.type && rules.type !== FieldTypes.ANY) {
    const actualType = Array.isArray(value) ? 'array' : typeof value

    if (rules.type !== actualType) {
      return {
        valid: false,
        error: `Field '${fieldName}' expects ${rules.type}, got ${actualType}`,
      }
    }
  }

  // 字符串最小长度
  if (rules.minLength !== undefined && typeof value === 'string') {
    if (value.length < rules.minLength) {
      return {
        valid: false,
        error: `Field '${fieldName}' must be at least ${rules.minLength} characters`,
      }
    }
  }

  // 字符串最大长度
  if (rules.maxLength !== undefined && typeof value === 'string') {
    if (value.length > rules.maxLength) {
      return {
        valid: false,
        error: `Field '${fieldName}' must be at most ${rules.maxLength} characters`,
      }
    }
  }

  // 数值最小值
  if (rules.min !== undefined && typeof value === 'number') {
    if (value < rules.min) {
      return {
        valid: false,
        error: `Field '${fieldName}' must be at least ${rules.min}`,
      }
    }
  }

  // 数值最大值
  if (rules.max !== undefined && typeof value === 'number') {
    if (value > rules.max) {
      return {
        valid: false,
        error: `Field '${fieldName}' must be at most ${rules.max}`,
      }
    }
  }

  // 枚举值校验
  if (rules.enum && Array.isArray(rules.enum)) {
    if (!rules.enum.includes(value)) {
      return {
        valid: false,
        error: `Field '${fieldName}' must be one of: ${rules.enum.join(', ')}`,
      }
    }
  }

  // 正则校验
  if (rules.pattern && typeof value === 'string') {
    if (!rules.pattern.test(value)) {
      return {
        valid: false,
        error: `Field '${fieldName}' format is invalid`,
      }
    }
  }

  // 自定义校验函数
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
 * 校验数据对象
 * @param {Object} data - 要校验的数据
 * @param {Array<string>} requiredFields - 必填字段列表
 * @param {Object} schema - 字段规则定义
 * @returns {{valid: boolean, message?: string, errors?: Array<string>}}
 */
export function validateData(data, requiredFields = [], schema = {}) {
  const errors = []

  // 检查数据类型
  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      message: 'Data must be a non-null object',
      errors: ['Data must be a non-null object'],
    }
  }

  // 检查必填字段
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`Field '${field}' is required`)
    }
  }

  // 根据 schema 校验各字段
  for (const [fieldName, rules] of Object.entries(schema)) {
    const result = validateField(data[fieldName], fieldName, rules)
    if (!result.valid) {
      errors.push(result.error)
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      message: errors[0], // 返回第一个错误作为主要消息
      errors,
    }
  }

  return { valid: true }
}

/**
 * 安全获取嵌套对象属性
 * @param {Object} obj - 对象
 * @param {string} path - 属性路径（如 'a.b.c'）
 * @param {any} defaultValue - 默认值
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
 * 生成唯一 ID
 * @param {string} [prefix] - ID 前缀
 * @returns {string}
 */
export function generateId(prefix = '') {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 10)
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`
}

/**
 * 深度克隆对象（简单实现，处理常见场景）
 * @param {any} obj - 要克隆的对象
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
