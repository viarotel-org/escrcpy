import { defineStore } from 'pinia'

const $appStore = window.appStore

const removeDot = value => value.replaceAll('.', '_')

export const useDeviceStore = defineStore({
  id: 'app-device',
  state() {
    return {
      config: {},
    }
  },
  getters: {},
  actions: {
    removeDot,
    init() {
      this.config = {
        ...($appStore.get('device') || {}),
      }

      return this.config
    },
    setConfig(value, key = 'device') {
      $appStore.set(key, value)
      this.init()
    },
    setRemark(deviceId, value) {
      $appStore.set(`device.${removeDot(deviceId)}.remark`, value)
      this.init()
    },
    getRemark(deviceId) {
      const value = $appStore.get(`device.${removeDot(deviceId)}.remark`)
      return value
    },
  },
})
