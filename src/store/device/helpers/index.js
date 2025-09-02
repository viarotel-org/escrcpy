import { defaultsDeep, groupBy, keyBy, omit } from 'lodash-es'
import { deviceStatus as deviceStatusDict } from '$/dicts/device/index.js'

/**
 * 获取设备名称
 */
export function getDeviceName(device) {
  return device.product ? device.product.split(':')[1] : '未授权设备'
}

/**
 * 获取备注名称
 */
export function getRemark(deviceId) {
  const value = window.appStore.get('device')?.[deviceId]?.remark
  return value
}

/**
 * 获取历史设备列表
 */
export function getHistoryDevices() {
  const devices = window.appStore.get('device') || {}

  const value = Object.values(devices).map(device => ({
    ...device,
    status: 'offline',
  }))

  return value
}

/**
 * 获取当前连接的设备
 */
export async function getCurrentDevices() {
  const devices = await window.adb.getDeviceList() || []

  return devices.map(device => ({
    ...device,
    id: device.id,
    status: device.type,
    name: getDeviceName(device),
    wifi: device.id.includes(':'),
    remark: getRemark(device.id),
  }))
}

/**
 * 迁移 scrcpy 配置
 */
function migrateScrcpyConfig(oldDeviceId, newDeviceId) {
  if (oldDeviceId === newDeviceId) {
    return
  }

  const scrcpyConfig = window.appStore.get('scrcpy') || {}

  // 检查旧设备是否有配置
  if (scrcpyConfig[oldDeviceId]) {
    const oldConfig = { ...scrcpyConfig[oldDeviceId] }

    // 删除旧配置
    delete scrcpyConfig[oldDeviceId]

    // 如果新设备没有配置，则迁移旧配置
    if (!scrcpyConfig[newDeviceId]) {
      scrcpyConfig[newDeviceId] = oldConfig
    }

    // 保存更新后的配置
    window.appStore.set('scrcpy', scrcpyConfig)

    console.log(`Migrated scrcpy config from ${oldDeviceId} to ${newDeviceId}`)
  }
}

/**
 * 合并历史和当前设备列表
 */
export function mergeDevices(historyDevices, currentDevices) {
  const historyMap = keyBy(historyDevices, 'id')
  const currentMap = keyBy(currentDevices, 'id')

  const sortModel = deviceStatusDict.reduce((obj, item, index) => {
    obj[item.value] = index
    return obj
  }, {})

  // 先进行基本合并
  const basicMergeList = Object.values(defaultsDeep(currentMap, historyMap))

  // 过滤掉排除的关键词
  const excludedKeywords = []
  const filteredList = basicMergeList.filter(({ id = '' }) => !excludedKeywords.some(keyword => id.includes(keyword)))

  // 基于 serialNo 进行去重处理
  const serialNoGroups = groupBy(filteredList, 'serialNo')
  const deduplicatedList = []

  Object.entries(serialNoGroups).forEach(([serialNo, devices]) => {
    if (!serialNo || serialNo === 'undefined') {
      // 如果没有 serialNo，直接添加（保持原有逻辑）
      deduplicatedList.push(...devices)
      return
    }

    // 按有线/无线分组
    const wiredDevices = devices.filter(device => !device.wifi)
    const wirelessDevices = devices.filter(device => device.wifi)

    // 保留一个有线设备（优先 currentDevices）
    if (wiredDevices.length > 0) {
      const wiredDevice = wiredDevices.find(device => currentMap[device.id]) || wiredDevices[0]
      deduplicatedList.push(wiredDevice)
    }

    // 处理无线设备去重和配置迁移
    if (wirelessDevices.length > 0) {
      // 优先选择 currentDevices 中的无线设备
      const currentWirelessDevice = wirelessDevices.find(device => currentMap[device.id])
      const selectedWirelessDevice = currentWirelessDevice || wirelessDevices[0]

      // 迁移其他无线设备的配置到选中的设备
      wirelessDevices.forEach((device) => {
        if (device.id !== selectedWirelessDevice.id) {
          migrateScrcpyConfig(device.id, selectedWirelessDevice.id)
        }
      })

      deduplicatedList.push(selectedWirelessDevice)
    }
  })

  const value = deduplicatedList.sort((a, b) => sortModel[a.status] - sortModel[b.status])

  return value
}

/**
 * 保存设备信息到存储
 */
export function saveDevicesToStore(devices) {
  const cleanedDevices = devices
    .filter(device => !['unauthorized'].includes(device.status))
    .map(device => omit(device, ['status']))

  window.appStore.set('device', keyBy(cleanedDevices, 'id'))
}
