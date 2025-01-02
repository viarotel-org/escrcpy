import { defaultsDeep, keyBy, omit } from 'lodash-es'
import { isIPWithPort } from '$/utils/index.js'
import { deviceStatus as deviceStatusDict } from '$/dicts/device/index.js'

/**
 * 获取设备名称
 */
export function getDeviceName(device) {
  return device.model ? device.model.split(':')[1] : '未授权设备'
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
  const devices = await window.adb.getDevices() || []

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
 * 合并历史和当前设备列表
 */
export function mergeDevices(historyDevices, currentDevices) {
  const historyMap = keyBy(historyDevices, 'id')
  const currentMap = keyBy(currentDevices, 'id')

  const sortModel = deviceStatusDict.reduce((obj, item, index) => {
    obj[item.value] = index
    return obj
  }, {})

  const mergeList = Object.values(defaultsDeep(currentMap, historyMap))

  const excludedKeywords = ['_adb-tls-connect', '_tcp']
  const filterList = mergeList.filter(({ id = '' }) => !excludedKeywords.some(keyword => id.includes(keyword)))

  const value = filterList.sort((a, b) => sortModel[a.status] - sortModel[b.status])

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
