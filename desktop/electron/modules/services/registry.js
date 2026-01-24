/**
 * Service Registry
 * Centralized service registration and management
 */

/**
 * Service configuration interface
 * @typedef {Object} ServiceConfig
 * @property {string} name - Service name identifier
 * @property {Function} loader - Service loader function
 * @property {boolean} [enabled] - Whether service is enabled (default: true)
 * @property {number} [priority] - Load priority (higher first, default: 0)
 */

/**
 * Service registry store
 * @type {Map<string, ServiceConfig>}
 */
const serviceRegistry = new Map()

/**
 * Register a service
 * @param {ServiceConfig} config - Service configuration
 */
export function registerService(config) {
  const { name, loader, enabled = true, priority = 0 } = config

  if (!name || !loader) {
    throw new Error('Service name and loader are required')
  }

  if (typeof loader !== 'function') {
    throw new TypeError('Service loader must be a function')
  }

  serviceRegistry.set(name, {
    name,
    loader,
    enabled,
    priority,
  })
}

/**
 * Get all registered services
 * @param {boolean} [enabledOnly] - Only return enabled services
 * @returns {ServiceConfig[]} Sorted by priority (descending)
 */
export function getAllServices(enabledOnly = true) {
  const services = Array.from(serviceRegistry.values())

  const filtered = enabledOnly ? services.filter(svc => svc.enabled) : services

  return filtered.sort((a, b) => b.priority - a.priority)
}

/**
 * Get service by name
 * @param {string} name - Service name
 * @returns {ServiceConfig | undefined}
 */
export function getService(name) {
  return serviceRegistry.get(name)
}

/**
 * Check if service exists
 * @param {string} name - Service name
 * @returns {boolean}
 */
export function hasService(name) {
  return serviceRegistry.has(name)
}

/**
 * Unregister a service
 * @param {string} name - Service name
 * @returns {boolean} True if unregistered, false if not found
 */
export function unregisterService(name) {
  return serviceRegistry.delete(name)
}

/**
 * Clear all service registrations
 */
export function clearRegistry() {
  serviceRegistry.clear()
}
