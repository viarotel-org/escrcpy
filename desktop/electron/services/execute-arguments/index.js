import minimist from 'minimist'
import { snakeCase, toUpper } from 'lodash-es'

/**
 * Parse command-line arguments into an object
 * @param {string[]} commandLine - Array of command-line arguments
 * @returns {Object} Parsed arguments object
 */
function parseExecuteArguments(commandLine) {
  return minimist(commandLine)
}

/**
 * Inject parsed arguments into process.env as EXECUTE_ARG_* variables
 * @param {Object} executeArgs - Parsed arguments object
 */
function injectExecuteArguments(executeArgs) {
  Object.entries(executeArgs).forEach(([key, value]) => {
    // Skip underscore (minimist's default for positional args) and boolean properties
    if (key === '_' || typeof value === 'boolean') {
      return
    }

    const envKey = `EXECUTE_ARG_${toUpper(snakeCase(key))}`
    process.env[envKey] = String(value)
  })
}

export default {
  name: 'service:execute-arguments',
  async apply(appContext) {
    const initialArgs = parseExecuteArguments(process.argv)
    injectExecuteArguments(initialArgs)

    const api = {
      parseExecuteArguments,
      injectExecuteArguments,
      getArguments() {
        return initialArgs
      },
    }

    appContext?.provide?.('service:execute-arguments', api)

    return api
  },
}
