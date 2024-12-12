import { defineStore } from 'pinia'
import dayjs from 'dayjs'

import { capitalize } from 'lodash-es'

import { name as packageName } from '$root/package.json'

import {
  getCurrentDevices,
  getHistoryDevices,
  mergeDevices,
  saveDevicesToStore,
} from './helpers/index.js'

const $appStore = window.appStore

export const useDeviceStore = defineStore({
  id: 'app-device',
  state() {
    return {
      list: [],
      config: {},
    }
  },
  getters: {},
  actions: {
    init() {
      this.config = {
        ...($appStore.get('device') || {}),
      }

      return this.config
    },
    getLabel(device, params) {
      if (!device.id) {
        return ''
      }

      const data = device?.id
        ? device
        : this.list.find(item => item.id === device)

      const appName = capitalize(packageName)

      const deviceName = `${data?.remark || data.name}${data.wifi ? '(WIFI)' : ''}`

      const currentTime = dayjs().format('YYYYMMDDHHmmss')

      let value = `${appName}-${deviceName}`

      const createPreset = type => `${appName}${capitalize(type)}-${deviceName}`

      const presets = {
        ...[
          'mirror',
          'camera',
          'custom',
          'synergy',
        ]
          .reduce((obj, type) => {
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
    },
    setList(data) {
      this.list = data
    },
    /**
     * 获取设备列表
     * @returns {Promise<Array>} 合并后的设备列表
     */
    async getList() {
      const historyDevices = getHistoryDevices()

      const currentDevices = await getCurrentDevices()

      const mergedDevices = mergeDevices(historyDevices, currentDevices)

      saveDevicesToStore(mergedDevices)

      this.list = mergedDevices

      return mergedDevices
    },
    setConfig(value, key = 'device') {
      $appStore.set(key, value)
      this.init()
    },
    setRemark(deviceId, value) {
      $appStore.set(['device', deviceId, 'remark'], value)
      this.init()
    },
  },
})
