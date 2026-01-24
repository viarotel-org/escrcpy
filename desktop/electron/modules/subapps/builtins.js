/**
 * Built-in SubApps
 * Pre-configured sub-applications
 */

import { registerSubApp } from './registry.js'

/**
 * Register all built-in sub-applications
 */
export function registerBuiltInSubApps() {
  // Control window subapp
  registerSubApp({
    name: 'control',
    loader: async () => {
      const controlModule = await import('$control/electron/main.js')
      controlModule.default()
    },
    priority: 10,
  })

  // Explorer window subapp
  registerSubApp({
    name: 'explorer',
    loader: async () => {
      const explorerModule = await import('$explorer/electron/main.js')
      explorerModule.default()
    },
    priority: 5,
  })

  // Copilot window subapp
  registerSubApp({
    name: 'copilot',
    loader: async () => {
      const copilotModule = await import('$copilot/electron/main.js')
      copilotModule.default()
    },
    priority: 1,
  })
}
