import { defineStore } from 'pinia'

import { isIPWithPort, replaceIP } from '@/utils/index.js'

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
