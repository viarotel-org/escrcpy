import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { capitalize } from 'lodash-es'
import { ref } from 'vue'
import { name as packageName } from '$root/package.json'
import {
  getCurrentDevices,
  getHistoryDevices,
  mergeDevices,
  saveDevicesToStore,
} from './helpers/index.js'

const $appStore = window.appStore

export const useDeviceStore = defineStore('app-device', () => {
  const list = ref([])
  const config = ref({})

  function init() {
    config.value = {
      ...($appStore.get('device') || {}),
    }
    return config.value
  }

  function getLabel(device, params) {
    const data = device?.id
      ? device
      : list.value.find(item => item.id === device)

    if (!data) {
      return ''
    }

    const appName = capitalize(packageName)
    const deviceSerial = data.id.replaceAll(/[<>:"/\\|?*]/g, '_')
    const deviceName = `${data.remark || data.name}[${deviceSerial}]`
    const currentTime = dayjs().format('YYYYMMDDHHmmss')
    let value = `${deviceName}-${appName}`

    const createPreset = type => `${capitalize(type)}-${deviceName}-${appName}`

    const presets = {
      ...[
        'mirror',
        'camera',
        'custom',
        'synergy',
      ].reduce((obj, type) => {
        obj[type] = createPreset(type)
        return obj
      }, {}),
      screenshot: `Screenshot-${deviceName}-${currentTime}`,
    }

    if (typeof params === 'function') {
      value = params({
        data,
        appName,
        deviceName,
        currentTime,
      })
    }
    else if (params && typeof params === 'string') {
      value = presets[params]
    }

    return value
  }

  async function getList() {
    const historyDevices = getHistoryDevices()
    const currentDevices = await getCurrentDevices()
    const mergedDevices = mergeDevices(historyDevices, currentDevices)
    saveDevicesToStore(mergedDevices)
    list.value = mergedDevices
    return mergedDevices
  }

  function setRemark(deviceId, value) {
    $appStore.set(['device', deviceId, 'remark'], value)
    init()
  }

  return {
    list,
    config,
    init,
    getLabel,
    getList,
    setRemark,
  }
})
