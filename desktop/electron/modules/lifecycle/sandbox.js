/**
 * Sandbox Configuration Manager
 * Handles sandbox setup before app initialization
 */

import sandboxManager from '$electron/helpers/sandbox.js'

/**
 * Configure sandbox based on platform and environment
 * @returns {Promise<void>}
 */
export async function configureSandbox() {
  try {
    await sandboxManager.configureSandbox()
  }
  catch (error) {
    console.error('[Lifecycle] Sandbox configuration failed:', error.message)
    // Non-critical error, allow app to continue
  }
}
