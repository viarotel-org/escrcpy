import minimist from 'minimist'
import { snakeCase, toUpper } from 'lodash-es'

const envPrefix = 'EXECUTE_ARG_'

/**
 * Parse command-line arguments into an object
 */
export function parseExecuteArguments(commandLine = []) {
  return minimist(commandLine)
}

/**
 * Inject parsed arguments into process.env as prefixed variables
 */
export function injectExecuteArguments(executeArgs = {}) {
  Object.entries(executeArgs).forEach(([key, value]) => {
    // Skip underscore (minimist's default for positional args) and boolean properties
    if (key === '_' || typeof value === 'boolean') {
      return
    }

    const envKey = `${envPrefix}${toUpper(snakeCase(key))}`
    process.env[envKey] = String(value)
  })
}
