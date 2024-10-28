/**
 * Convert object parameters to command line arguments string
 * @param {Object} options - The options object containing parameters
 * @returns {string} The formatted command line arguments string
 */
function stringify(options) {
  if (typeof options === 'string') {
    return options
  }

  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('Options must be a plain object')
  }

  const args = []

  // Helper function to format parameter names
  const formatParamName = (name) => {
    // 验证参数名称的合法性
    if (typeof name !== 'string' || !name.length) {
      throw new TypeError('Parameter name must be a non-empty string')
    }

    if (name.startsWith('-')) {
      return name
    }

    return name.length === 1
      ? `-${name}`
      : `--${name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`
  }

  // Helper function to format values based on their types
  const formatValue = (value) => {
    if (value === null || value === undefined) {
      throw new TypeError('Value cannot be null or undefined')
    }

    if (typeof value === 'string') {
      // 处理空字符串
      if (!value.length) {
        return '""'
      }
      // 转义引号并在需要时添加引号
      const needsQuotes = /[\s"']/.test(value)
      return needsQuotes ? `"${value.replace(/"/g, '\\"')}"` : value
    }

    if (typeof value === 'number') {
      if (!Number.isFinite(value)) {
        throw new TypeError('Number values must be finite')
      }
      return value.toString()
    }

    if (typeof value === 'boolean') {
      return '' // 布尔值不需要返回值
    }

    if (Array.isArray(value)) {
      return formatValue(value.join(','))
    }

    throw new TypeError(`Unsupported value type: ${typeof value}`)
  }

  // Process each option
  for (const [key, value] of Object.entries(options)) {
    // Skip null or undefined values
    if ([null, undefined, false, ''].includes(value)) {
      continue
    }

    const paramName = formatParamName(key)

    // Handle boolean flags
    if (typeof value === 'boolean') {
      if (value) {
        args.push(paramName)
      }
      continue
    }

    // Handle array values
    if (Array.isArray(value)) {
      if (value.length === 0) {
        continue // 跳过空数组
      }
      value.forEach((item) => {
        if (![null, undefined, false, ''].includes(item)) {
          const formattedValue = formatValue(item)
          if (formattedValue) {
            args.push(`${paramName}=${formattedValue}`)
          }
        }
      })
      continue
    }

    // Handle regular key-value pairs
    const formattedValue = formatValue(value)
    if (formattedValue) {
      args.push(`${paramName}=${formattedValue}`)
    }
  }

  return args.join(' ')
}

export { stringify }

export default { stringify }
