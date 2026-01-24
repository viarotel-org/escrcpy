/**
 * Arguments Module
 * Command-line arguments processing
 */

export {
  createSecondInstanceHandler,
  handleExecuteArguments,
} from './handler.js'

export {
  clearEnvironmentVariables,
  getEnvironmentVariable,
  injectEnvironmentVariables,
} from './injector.js'

export {
  extractExecuteArguments,
  hasDeviceLaunchArgs,
  parseArguments,
} from './parser.js'
