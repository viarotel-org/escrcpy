/**
 * Execute arguments service - Maps command-line arguments to environment variables.
 *
 * This service processes command-line arguments and:
 * 1. Converts them to EXECUTE_ARG_* environment variables
 * 2. Handles special cases like --minimized flag
 * 3. Provides utilities for injecting arguments into the process
 *
 * This is essential for supporting:
 * - Initial app startup with device parameters
 * - Second instance launch with new parameters
 * - Command-line shortcuts and auto-launch scenarios
 */

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

export default (app) => {
  // Process initial command-line arguments on app startup
  const initialArgs = parseExecuteArguments(process.argv)
  injectExecuteArguments(initialArgs)

  // Provide utilities to other plugins/modules
  const api = {
    parseExecuteArguments,
    injectExecuteArguments,
    getArguments() {
      return initialArgs
    },
  }

  // Provide service for injection by other modules
  app?.provide?.('service:execute-arguments', api)

  return api
}
