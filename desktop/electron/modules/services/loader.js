/**
 * Service Loader
 * Dynamic service loading and initialization
 */

import { getAllServices } from './registry.js'

/**
 * Load and initialize all registered services
 * @returns {Promise<void>}
 */
export async function loadServices() {
  const services = getAllServices()

  for (const service of services) {
    try {
      await service.loader()
      console.log(`[Services] Loaded: ${service.name}`)
    }
    catch (error) {
      console.error(`[Services] Failed to load ${service.name}:`, error)
      throw error
    }
  }
}

/**
 * Load a specific service by name
 * @param {string} name - Service name
 * @returns {Promise<void>}
 */
export async function loadService(name) {
  const services = getAllServices(false)
  const service = services.find(svc => svc.name === name)

  if (!service) {
    throw new Error(`Service not found: ${name}`)
  }

  if (!service.enabled) {
    console.warn(`[Services] Service disabled: ${name}`)
    return
  }

  try {
    await service.loader()
    console.log(`[Services] Loaded: ${name}`)
  }
  catch (error) {
    console.error(`[Services] Failed to load ${name}:`, error)
    throw error
  }
}
