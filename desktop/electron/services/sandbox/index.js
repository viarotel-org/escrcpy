/**
 * Sandbox configuration plugin for Electron app initialization.
 * Must run before any Electron window creation to ensure proper sandbox mode.
 *
 * This plugin is placed early in the startup sequence (order: -100) to configure
 * sandbox settings before any other plugins execute.
 */

import { sandboxManager } from './helper.js'

export default async (app) => {
  try {
    const result = await sandboxManager.configureSandbox()
    app?.emit?.('sandbox:configured', result)
    return result
  }
  catch (error) {
    console.error('[plugin:sandbox-config] Failed to configure sandbox:', error)
    app?.emit?.('sandbox:config-error', error)
    throw error
  }
}
