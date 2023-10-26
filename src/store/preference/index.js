import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash-es'
import model from './model/index.js'

import {
  getDefaultData,
  getModelFields,
  getOtherFields,
  getStoreData,
  mergeConfig,
  setStoreData,
} from './helpers/index.js'

import { replaceIP } from '@/utils/index.js'

const { adbPath, scrcpyPath } = window.electron?.configs || {}

export const usePreferenceStore = defineStore({
  id: 'app-preference',
  state() {
    return {
      model: cloneDeep(model),
      data: { ...getDefaultData() },
      deviceScope: window.appStore.get('scrcpy.deviceScope') || 'global',

      scrcpyExcludeKeys: ['--record-format', ...getOtherFields('scrcpy')],
    }
  },
  getters: {
    modelList() {
      return Object.values(this.model)
    },
  },
  actions: {
    getDefaultData,
    init(scope = this.deviceScope) {
      const data = mergeConfig(getDefaultData(), getStoreData(scope))

      this.data = data

      return this.data
    },
    setScope(value) {
      this.deviceScope = replaceIP(value)
      window.appStore.set('scrcpy.deviceScope', this.deviceScope)
      this.init()
    },
    setData(data, scope = this.deviceScope) {
      const cloneData = cloneDeep(data)

      // console.log('adbPath', adbPath)
      // console.log('scrcpyPath', scrcpyPath)

      if (data.adbPath === adbPath) {
        delete cloneData.adbPath
      }

      if (data.scrcpyPath === scrcpyPath) {
        delete cloneData.scrcpyPath
      }

      setStoreData(cloneData, scope)

      this.init(scope)
    },
    reset(scope) {
      if (!scope) {
        window.appStore.reset()
      }
      else {
        const fields = getModelFields()

        fields.forEach((key) => {
          if (key === 'scrcpy') {
            this.deviceScope = scope
            window.appStore.set(`scrcpy.${replaceIP(scope)}`, {})
            return false
          }
          window.appStore.set(key, {})
        })
      }

      this.init()
    },
    resetDeps(type) {
      switch (type) {
        case 'adb':
          window.appStore.set('common.adbPath', '')
          break
        case 'scrcpy':
          window.appStore.set('common.scrcpyPath', '')
          break
        default:
          window.appStore.set('common.adbPath', '')
          window.appStore.set('common.scrcpyPath', '')
          break
      }
      this.init()
    },
    getData(scope = this.scope) {
      const value = this.init(scope)
      return value
    },
    getScrcpyData(scope = this.scope) {
      const data = this.getData(scope)

      if (!data) {
        return ''
      }

      const value = Object.entries(data)
        .reduce((arr, [key, value]) => {
          if (!value) {
            return arr
          }

          if (this.scrcpyExcludeKeys.includes(key)) {
            return arr
          }

          if (typeof value === 'boolean') {
            arr.push(key)
          }
          else {
            arr.push(`${key}=${value}`)
          }

          return arr
        }, [])
        .join(' ')

      console.log('getScrcpyData.value', value)

      return value
    },
    getModel(key, params) {
      const handler = this.model[key]
      const value = handler(params)
      // console.log('setModel.value', value)

      return value
    },
    setModelParams(key, ...args) {
      const handler = this.model[key]?.children

      if (!handler) {
        return false
      }

      const value = handler(...args)

      console.raw('setModelParams.value', value)

      this.model[key].children = () => value

      return this.model
    },
    resetModel(key) {
      const keys = []
      if (key) {
        keys.push(key)
      }
      else {
        keys.push(...Object.keys(model))
      }

      keys.forEach((value) => {
        if (!this.model?.[value]?.children) {
          return false
        }

        this.model[value].children = (...args) =>
          model[value].children(...args)
      })

      return true
    },
  },
})
