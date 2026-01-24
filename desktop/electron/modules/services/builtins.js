/**
 * Built-in Services
 * Pre-configured application services
 */

import { registerService } from './registry.js'

/**
 * Register all built-in services
 */
export function registerBuiltInServices() {
  // App global events - highest priority
  registerService({
    name: 'app',
    loader: async () => {
      const appModule = await import('$electron/services/app/index.js')
      appModule.default()
    },
    priority: 100,
  })

  // IPC Handlers - high priority
  registerService({
    name: 'handles',
    loader: async () => {
      const handlesModule = await import('$electron/services/handles/index.js')
      handlesModule.default()
    },
    priority: 90,
  })

  // Theme service
  registerService({
    name: 'theme',
    loader: async () => {
      const themeModule = await import('$electron/services/theme/index.js')
      themeModule.default()
    },
    priority: 80,
  })

  // Shortcuts
  registerService({
    name: 'shortcuts',
    loader: async () => {
      const shortcutsModule = await import('$electron/services/shortcuts/index.js')
      shortcutsModule.default()
    },
    priority: 70,
  })

  // Window controls
  registerService({
    name: 'window',
    loader: async () => {
      const windowModule = await import('$electron/services/window/index.js')
      windowModule.default()
    },
    priority: 60,
  })

  // Auto updater
  registerService({
    name: 'updater',
    loader: async () => {
      const updaterModule = await import('$electron/services/updater/index.js')
      updaterModule.default()
    },
    priority: 50,
  })

  // System tray
  registerService({
    name: 'tray',
    loader: async () => {
      const trayModule = await import('$electron/services/tray/index.js')
      trayModule.default()
    },
    priority: 40,
  })

  // Auto launch
  registerService({
    name: 'launch',
    loader: async () => {
      const launchModule = await import('$electron/services/launch/index.js')
      launchModule.default()
    },
    priority: 30,
  })
}
