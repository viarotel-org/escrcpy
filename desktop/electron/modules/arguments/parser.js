/**
 * Arguments Parser
 * Parse and normalize command-line arguments
 */

import minimist from 'minimist'

/**
 * Parse command-line arguments
 * @param {string[]} argv - Command-line arguments
 * @returns {Object} Parsed arguments
 */
export function parseArguments(argv) {
  return minimist(argv)
}

/**
 * Extract execute arguments from command-line
 * @param {string[]} commandLine - Command-line arguments
 * @returns {Object} Execute arguments with normalized keys
 */
export function extractExecuteArguments(commandLine) {
  const args = parseArguments(commandLine)

  return {
    minimized: args.minimized || false,
    deviceId: args['device-id'] || null,
    appName: args['app-name'] || null,
    packageName: args['package-name'] || null,
  }
}

/**
 * Check if arguments contain device launch parameters
 * @param {Object} args - Parsed arguments
 * @returns {boolean}
 */
export function hasDeviceLaunchArgs(args) {
  return Boolean(args.deviceId)
}
