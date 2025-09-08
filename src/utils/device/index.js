import { allSettledWrapper, sleep } from '$/utils'
import { defaultsDeep } from 'lodash-es'
/**
 * 选择并将文件发送到设备
 */
export async function selectAndSendFileToDevice(
  deviceId,
  {
    files,
    multiSelections = false,
    silent = false,
    extensions = ['*'],
    selectText = window.t('device.control.file.push.placeholder'),
    loadingText = window.t('device.control.file.push.loading'),
    successText = window.t('device.control.file.push.success.name'),
  } = {},
) {
  if (!files) {
    try {
      const properties = ['openFile']

      if (multiSelections) {
        properties.push('multiSelections')
      }

      files = await window.electron.ipcRenderer.invoke('show-open-dialog', {
        properties,
        filters: [
          {
            name: selectText,
            extensions,
          },
        ],
      })
    }
    catch (error) {
      throw new Error(error.message?.match(/Error: (.*)/)?.[1] || error.message)
    }
  }

  let closeLoading
  if (!silent) {
    closeLoading = ElMessage.loading(`${deviceId}: ${loadingText}`).close
  }

  const successFiles = []
  const failFiles = []

  await allSettledWrapper(files, async (item) => {
    const ret = await window.adb.push(deviceId, item).catch((e) => {
      console.warn(e?.message)
      failFiles.push(`${deviceId}-${item}`)
    })

    if (ret) {
      successFiles.push(ret)
    }
  })

  await sleep()

  if (failFiles.length) {
    closeLoading?.()
    throw new Error(`Push file failed: ${failFiles.join(',')}`)
  }

  closeLoading?.()

  if (!silent) {
    ElMessage.success({ message: successText, grouping: true })
  }

  return successFiles
}

export function openFloatControl(deviceInfo) {
  const floatControl = window.appStore.get('common.floatControl')

  if (!floatControl) {
    return false
  }

  window.electron.ipcRenderer.invoke('open-control-window', deviceInfo)
}

/**
 * 查找目标设备（通过 serialNo 匹配）
 * @param {Object} sourceDevice - 源设备对象
 * @param {Array} deviceList - 设备列表
 * @returns {Array} 匹配的目标设备数组
 */
export function findTargetDevices(sourceDevice, deviceList) {
  if (!sourceDevice?.serialNo || !Array.isArray(deviceList)) {
    return []
  }

  // 从设备列表中查找具有相同 serialNo 但不同 id 的设备
  return deviceList.filter((targetDevice) => {
    return targetDevice.serialNo === sourceDevice.serialNo
      && targetDevice.id !== sourceDevice.id
  })
}

/**
 * 查找与历史设备序列号匹配的当前设备
 * @param {Object} historyDevice - 历史设备对象
 * @param {Array} currentDevices - 当前设备列表
 * @returns {Array} 匹配的当前设备列表
 */
export function findMatchingCurrentDevices(historyDevice, currentDevices) {
  return currentDevices.filter(device =>
    device.serialNo.includes(historyDevice.serialNo),
  )
}

/**
 * Scrcpy 配置迁移管理器
 * 用于在设备ID变更时迁移配置，并清理旧配置
 */
export class ScrcpyConfigMigrator {
  constructor() {
    this.processedDeviceIds = new Set()
  }

  /**
   * 从旧设备迁移配置到新设备
   * @param {string} oldDeviceId - 旧设备ID
   * @param {string} newDeviceId - 新设备ID
   * @returns {boolean} 是否成功迁移配置
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
