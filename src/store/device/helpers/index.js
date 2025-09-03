import { defaultsDeep, groupBy, keyBy } from 'lodash-es'
import { deviceStatus as deviceStatusDict } from '$/dicts/device/index.js'

/**
 * 获取无线设备优先级
 * 数字越小优先级越高
 */
function getWirelessDevicePriority(device) {
  if (['offline'].includes(device.type)) {
    return 40
  }

  if (device.id.includes(':5555')) {
    return 10
  }

  if (device.id.includes('_adb-tls-connect')) {
    return 30
  }

  return 20
}

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
    wifi: ([':', '_adb-tls-connect']).some(item => device.id.includes(item)),
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
    if (!serialNo) {
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
      // 优先选择 currentDevices 中的无线设备，并按优先级排序
      const currentWirelessDevices = wirelessDevices.filter(device => currentMap[device.id])
      let currentWirelessDevice = null

      if (currentWirelessDevices.length > 0) {
        // 按优先级排序，选择优先级最高的设备
        currentWirelessDevice = currentWirelessDevices.sort((a, b) =>
          getWirelessDevicePriority(a) - getWirelessDevicePriority(b),
        )[0]
      }

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
    .map(device => ({
      ...device,
      status: 'offline',
      type: 'offline',
    }))

  window.appStore.set('device', keyBy(cleanedDevices, 'id'))
}
