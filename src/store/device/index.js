import { defineStore } from 'pinia'

const $appStore = window.appStore

const removeDots = value => value.replaceAll('.', '_')

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
    removeDots,
    init() {
      this.config = {
        ...($appStore.get('device') || {}),
      }

      return this.config
    },
    setList(data) {
      this.list = data
    },
    setConfig(value, key = 'device') {
      $appStore.set(key, value)
      this.init()
    },
    setRemark(deviceId, value) {
      $appStore.set(`device.${removeDots(deviceId)}.remark`, value)
      this.init()
    },
    getRemark(deviceId) {
      const value = $appStore.get(`device.${removeDots(deviceId)}.remark`)
      return value
    },
  },
})
