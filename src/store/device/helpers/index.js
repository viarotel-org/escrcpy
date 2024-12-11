import { defaultsDeep, keyBy, omit } from 'lodash-es'
import { isIPWithPort, replaceIP } from '$/utils/index.js'

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
  const value = window.appStore.get(`device.${replaceIP(deviceId)}.remark`)
  return value
}

/**
 * 获取历史设备列表
 */
export function getHistoryDevices() {
  const devices = window.appStore.get('devices') || []
  return devices.map(device => ({
    ...device,
    status: 'offline',
  }))
}

/**
 * 获取当前连接的设备
 */
export async function getCurrentDevices() {
  const rawDevices = await window.adb.getDevices() || []

  return rawDevices.map(device => ({
    ...device,
    id: device.id,
    status: device.type,
    name: getDeviceName(device),
    unauthorized: device.type === 'unauthorized',
    wifi: isIPWithPort(device.id),
    remark: getRemark(device.id),
  }))
}

/**
 * 合并历史和当前设备列表
 */
export function mergeDevices(historyDevices, currentDevices) {
  const historyMap = keyBy(historyDevices, 'id')
  const currentMap = keyBy(currentDevices, 'id')

  return Object.values(defaultsDeep(currentMap, historyMap))
}

/**
 * 保存设备信息到存储
 */
export function saveDevicesToStore(devices) {
  const cleanedDevices = devices.map(device =>
    omit(device, ['status', 'unauthorized']),
  )
  window.appStore.set('devices', cleanedDevices)
}
