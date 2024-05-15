import { defineStore } from 'pinia'
import dayjs from 'dayjs'

import { t } from '$/locales/index.js'
import { isIPWithPort, replaceIP } from '$/utils/index.js'

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
    getLabel(device, param) {
      if (!device) {
        return ''
      }

      const data = device?.id
        ? device
        : this.list.find(item => item.id === device)

      const labels = [data.$remark, data.$name, replaceIP(data.id)]

      const model = {
        recording: `🎥${t('device.record.progress')}...`,
        time: dayjs().format('YYYY_MM_DD_HH_mm_ss'),
      }

      if (typeof param === 'function') {
        labels.push(param(model))
      }
      else if (param && typeof param === 'string') {
        labels.push(model[param])
      }

      const value = labels.filter(item => !!item).join('-')

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
