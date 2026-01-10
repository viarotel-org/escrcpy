import { defaultsDeep } from 'lodash-es'

/**
 * Find target devices by matching serial numbers
 * @param {Object} sourceDevice - Source device object
 * @param {Array} deviceList - List of devices to search
 * @returns {Array} Array of matching target devices
 */
export function findTargetDevices(sourceDevice, deviceList) {
  if (!sourceDevice?.serialNo || !Array.isArray(deviceList)) {
    return []
  }

  // Find devices in the list that have the same serialNo but a different id
  return deviceList.filter((targetDevice) => {
    return targetDevice.serialNo === sourceDevice.serialNo
      && targetDevice.id !== sourceDevice.id
  })
}

/**
 * Find current devices that match a historical device's serial number
 * @param {Object} historyDevice - Historical device object
 * @param {Array} currentDevices - Current device list
 * @returns {Array} Array of matching current devices
 */
export function findMatchingCurrentDevices(historyDevice, currentDevices) {
  return currentDevices.filter(device =>
    device.serialNo.includes(historyDevice.serialNo),
  )
}

/**
 * Scrcpy configuration migrator
 * Used to migrate configuration when device IDs change and to clean up old configs
 */
export class ScrcpyConfigMigrator {
  constructor() {
    this.processedDeviceIds = new Set()
  }

  /**
   * Migrate configuration from an old device to a new device
   * @param {string} oldDeviceId - Old device ID
   * @param {string} newDeviceId - New device ID
   * @returns {boolean} True if migration succeeded
   */
  migrateConfigFromOldToNew(oldDeviceId, newDeviceId) {
    const scrcpyConfig = this.getScrcpyConfig()

    // Check whether migration is needed
    if (!this.hasConfig(scrcpyConfig, oldDeviceId)) {
      return false
    }

    // Perform configuration migration
    scrcpyConfig[newDeviceId] = defaultsDeep(scrcpyConfig[newDeviceId] || {}, scrcpyConfig[oldDeviceId])
    this.saveScrcpyConfig(scrcpyConfig)

    // Record processed device ID for later cleanup
    this.processedDeviceIds.add(oldDeviceId)

    console.log(`Successfully migrated scrcpy config: ${oldDeviceId} → ${newDeviceId}`)
    return true
  }

  /**
   * Clean up processed old device configurations
   */
  cleanupProcessedConfigs() {
    if (this.processedDeviceIds.size === 0) {
      return
    }

    const scrcpyConfig = this.getScrcpyConfig()

    this.processedDeviceIds.forEach((deviceId) => {
      delete scrcpyConfig[deviceId]
    })

    this.saveScrcpyConfig(scrcpyConfig)
    console.log(`Cleaned up ${this.processedDeviceIds.size} old device configs`)
  }

  /**
   * Get scrcpy configuration
   * @private
   * @returns {Object} scrcpy config object
   */
  getScrcpyConfig() {
    return window.appStore.get('scrcpy') || {}
  }

  /**
   * Save scrcpy configuration
   * @private
   * @param {Object} config - Configuration object
   */
  saveScrcpyConfig(config) {
    window.appStore.set('scrcpy', config)
  }

  /**
   * Check whether a device has configuration
   * @private
   * @param {Object} config - Configuration object
   * @param {string} deviceId - Device ID
   * @returns {boolean} Whether configuration exists
   */
  hasConfig(config, deviceId) {
    return Object.keys(config[deviceId] || {}).length > 0
  }
}
