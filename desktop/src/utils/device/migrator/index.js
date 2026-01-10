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

    // 检查是否需要迁移配置
    if (!this.hasConfig(scrcpyConfig, oldDeviceId)) {
      return false
    }

    // 执行配置迁移
    scrcpyConfig[newDeviceId] = defaultsDeep(scrcpyConfig[newDeviceId] || {}, scrcpyConfig[oldDeviceId])
    this.saveScrcpyConfig(scrcpyConfig)

    // 记录已处理的设备ID，用于后续清理
    this.processedDeviceIds.add(oldDeviceId)

    console.log(`Successfully migrated scrcpy config: ${oldDeviceId} → ${newDeviceId}`)
    return true
  }

  /**
   * 清理已处理的旧设备配置
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
   * 获取 scrcpy 配置
   * @private
   * @returns {Object} scrcpy 配置对象
   */
  getScrcpyConfig() {
    return window.appStore.get('scrcpy') || {}
  }

  /**
   * 保存 scrcpy 配置
   * @private
   * @param {Object} config - 配置对象
   */
  saveScrcpyConfig(config) {
    window.appStore.set('scrcpy', config)
  }

  /**
   * 检查设备是否有配置
   * @private
   * @param {Object} config - 配置对象
   * @param {string} deviceId - 设备ID
   * @returns {boolean} 是否有配置
   */
  hasConfig(config, deviceId) {
    return Object.keys(config[deviceId] || {}).length > 0
  }
}
