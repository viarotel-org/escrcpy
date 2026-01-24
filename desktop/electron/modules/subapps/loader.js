/**
 * SubApp Loader
 * Dynamic sub-application loading and initialization
 */

import { getAllSubApps } from './registry.js'

/**
 * Load and initialize all registered sub-applications
 * @returns {Promise<void>}
 */
export async function loadSubApps() {
  const subApps = getAllSubApps()

  for (const subApp of subApps) {
    try {
      await subApp.loader()
      console.log(`[SubApps] Loaded: ${subApp.name}`)
    }
    catch (error) {
      console.error(`[SubApps] Failed to load ${subApp.name}:`, error)
      throw error
    }
  }
}

/**
 * Load a specific sub-application by name
 * @param {string} name - SubApp name
 * @returns {Promise<void>}
 */
export async function loadSubApp(name) {
  const subApps = getAllSubApps(false)
  const subApp = subApps.find(app => app.name === name)

  if (!subApp) {
    throw new Error(`SubApp not found: ${name}`)
  }

  if (!subApp.enabled) {
    console.warn(`[SubApps] SubApp disabled: ${name}`)
    return
  }

  try {
    await subApp.loader()
    console.log(`[SubApps] Loaded: ${name}`)
  }
  catch (error) {
    console.error(`[SubApps] Failed to load ${name}:`, error)
    throw error
  }
}
