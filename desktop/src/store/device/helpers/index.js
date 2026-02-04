import { defaultsDeep, keyBy } from 'lodash-es'
import { deviceStatus as deviceStatusDict } from '$/dicts/device/index.js'

/**
 * Retrieve device name
 */
export function getDeviceName(device) {
  return device.product ? device.product.split(':')[1] : 'Unauthorized device'
}

/**
 * Get device remark
 */
export function getRemark(deviceId) {
  const value = window.$preload.store.get('device')?.[deviceId]?.remark
  return value
}

/**
 * Get history devices list
 */
export function getHistoryDevices() {
  const devices = window.$preload.store.get('device') || {}

  const value = Object.values(devices).map(device => ({
    ...device,
  }))

  return value
}

/**
 * Get currently connected devices
 */
export async function getCurrentDevices() {
  const devices = await window.$preload.adb.getDeviceList() || []

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
 * Merge history and current device lists
 * @param {Array} historyDevices - History devices list
 * @param {Array} currentDevices - Current devices list
 * @returns {Array} Merged device list
 */
export function mergeDevices(historyDevices, currentDevices) {
  // Merge device lists: current devices take precedence; history devices as defaults
  const historyDeviceMap = keyBy(historyDevices, 'id')
  const currentDeviceMap = keyBy(currentDevices, 'id')
  const mergedDeviceList = Object.values(defaultsDeep(currentDeviceMap, historyDeviceMap))

  // Sort by device status
  const sortedDeviceList = mergedDeviceList.sort((a, b) => deviceSortModel[a.status] - deviceSortModel[b.status])

  return sortedDeviceList
}

/**
 * Save device information to store
 */
export function saveDevicesToStore(devices) {
  const cleanedDevices = devices
    .filter(device => !['unauthorized'].includes(device.status))
    .map(device => ({
      ...device,
      status: 'offline',
      type: 'offline',
    }))

  window.$preload.store.set('device', keyBy(cleanedDevices, 'id'))
}
