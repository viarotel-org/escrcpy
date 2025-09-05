import { defaultsDeep, keyBy } from 'lodash-es'
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

export const deviceSortModel = deviceStatusDict.reduce((obj, item, index) => {
  obj[item.value] = index
  return obj
}, {})

/**
 * 合并历史和当前设备列表
 * @param {Array} historyDevices - 历史设备列表
 * @param {Array} currentDevices - 当前设备列表
 * @returns {Array} 合并后的设备列表
 */
export function mergeDevices(historyDevices, currentDevices) {
  // 合并设备列表：当前设备优先，历史设备作为默认值
  const historyDeviceMap = keyBy(historyDevices, 'id')
  const currentDeviceMap = keyBy(currentDevices, 'id')
  const mergedDeviceList = Object.values(defaultsDeep(currentDeviceMap, historyDeviceMap))

  // 按设备状态排序
  const sortedDeviceList = mergedDeviceList.sort((a, b) => deviceSortModel[a.status] - deviceSortModel[b.status])

  return sortedDeviceList
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
