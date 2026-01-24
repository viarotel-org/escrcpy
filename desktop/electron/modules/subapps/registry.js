/**
 * SubApp Registry
 * Centralized sub-application registration and management
 */

/**
 * SubApp configuration interface
 * @typedef {Object} SubAppConfig
 * @property {string} name - SubApp name identifier
 * @property {Function} loader - SubApp loader function
 * @property {boolean} [enabled] - Whether subapp is enabled (default: true)
 * @property {number} [priority] - Load priority (higher first, default: 0)
 */

/**
 * SubApp registry store
 * @type {Map<string, SubAppConfig>}
 */
const subAppRegistry = new Map()

/**
 * Register a sub-application
 * @param {SubAppConfig} config - SubApp configuration
 */
export function registerSubApp(config) {
  const { name, loader, enabled = true, priority = 0 } = config

  if (!name || !loader) {
    throw new Error('SubApp name and loader are required')
  }

  if (typeof loader !== 'function') {
    throw new TypeError('SubApp loader must be a function')
  }

  subAppRegistry.set(name, {
    name,
    loader,
    enabled,
    priority,
  })
}

/**
 * Get all registered sub-applications
 * @param {boolean} [enabledOnly] - Only return enabled subapps
 * @returns {SubAppConfig[]} Sorted by priority (descending)
 */
export function getAllSubApps(enabledOnly = true) {
  const subApps = Array.from(subAppRegistry.values())

  const filtered = enabledOnly ? subApps.filter(app => app.enabled) : subApps

  return filtered.sort((a, b) => b.priority - a.priority)
}

/**
 * Get sub-application by name
 * @param {string} name - SubApp name
 * @returns {SubAppConfig | undefined}
 */
export function getSubApp(name) {
  return subAppRegistry.get(name)
}

/**
 * Check if sub-application exists
 * @param {string} name - SubApp name
 * @returns {boolean}
 */
export function hasSubApp(name) {
  return subAppRegistry.has(name)
}

/**
 * Unregister a sub-application
 * @param {string} name - SubApp name
 * @returns {boolean} True if unregistered, false if not found
 */
export function unregisterSubApp(name) {
  return subAppRegistry.delete(name)
}

/**
 * Clear all sub-application registrations
 */
export function clearRegistry() {
  subAppRegistry.clear()
}
