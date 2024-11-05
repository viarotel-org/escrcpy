import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { capitalize } from 'lodash-es'
import { isIPWithPort, replaceIP } from '$/utils/index.js'

import { name as packageName } from '$root/package.json'

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
    replaceIP,
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

      const deviceName = `${data?.$remark || data.$name}${data.$wifi ? '(WIFI)' : ''}`

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
    async getList() {
      const res = await window.adbkit.getDevices()

      const data
        = res?.map(item => ({
          ...item,
          id: item.id,
          $name: item.model ? item.model.split(':')[1] : '未授权设备',
          $unauthorized: item.type === 'unauthorized',
          $wifi: isIPWithPort(item.id),
          $remark: this.getRemark(item.id),
        })) || []

      this.list = data

      return data
    },
    setConfig(value, key = 'device') {
      $appStore.set(key, value)
      this.init()
    },
    setRemark(deviceId, value) {
      $appStore.set(`device.${replaceIP(deviceId)}.remark`, value)
      this.init()
    },
    getRemark(deviceId) {
      const value = $appStore.get(`device.${replaceIP(deviceId)}.remark`)
      return value
    },
  },
})
