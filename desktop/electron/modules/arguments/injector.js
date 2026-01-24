/**
 * Environment Injector
 * Inject arguments into process environment variables
 */

import { snakeCase, toUpper } from 'lodash-es'

/**
 * Environment variable prefix for execute arguments
 */
const ENV_PREFIX = 'ESCRCPY_ARG'

/**
 * Inject arguments into environment variables
 * @param {Object} args - Arguments to inject
 * @returns {void}
 */
export function injectEnvironmentVariables(args) {
  Object.entries(args).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      const envKey = `${ENV_PREFIX}_${toUpper(snakeCase(key))}`
      process.env[envKey] = String(value)
    }
  })
}

/**
 * Get injected environment variable
 * @param {string} key - Argument key (camelCase or kebab-case)
 * @returns {string | undefined}
 */
export function getEnvironmentVariable(key) {
  const envKey = `${ENV_PREFIX}_${toUpper(snakeCase(key))}`
  return process.env[envKey]
}

/**
 * Clear all injected environment variables
 * @returns {void}
 */
export function clearEnvironmentVariables() {
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith(`${ENV_PREFIX}_`)) {
      delete process.env[key]
    }
  })
}
