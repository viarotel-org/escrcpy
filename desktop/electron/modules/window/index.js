/**
 * Window Module
 * Unified window management exports
 */

export { createMainWindow, createWindowFactory } from './factory.js'
export { windowManager } from './manager.js'
export {
  clearRegistry,
  getAllWindows,
  getMainWindow,
  getWindow,
  hasWindow,
  registerWindow,
} from './registry.js'
