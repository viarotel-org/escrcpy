/**
 * SubApps Module
 * Sub-application plugin system
 */

export { registerBuiltInSubApps } from './builtins.js'

export { loadSubApp, loadSubApps } from './loader.js'

export {
  clearRegistry,
  getAllSubApps,
  getSubApp,
  hasSubApp,
  registerSubApp,
  unregisterSubApp,
} from './registry.js'
