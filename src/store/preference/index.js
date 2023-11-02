import { defineStore } from 'pinia'
import { cloneDeep, get, set } from 'lodash-es'
import model from './model/index.js'

import {
  getDefaultData,
  getOtherFields,
  getStoreData,
  getTopFields,
  mergeConfig,
  setStoreData,
} from './helpers/index.js'

import { replaceIP, restoreIP } from '@/utils/index.js'

const { adbPath, scrcpyPath } = window.electron?.configs || {}

export const usePreferenceStore = defineStore({
  id: 'app-preference',
  state() {
    const deviceScope = restoreIP(
      window.appStore.get('scrcpy.deviceScope') || 'global',
    )

    return {
      model: cloneDeep(model),
      data: { ...getDefaultData() },
      deviceScope,
      scrcpyExcludeKeys: [
        '--record-format',
        '--video-code',
        '--audio-code',
        ...getOtherFields('scrcpy'),
      ],
    }
  },
  getters: {},
  actions: {
    getDefaultData,
    init(scope = this.deviceScope) {
      const globalData = mergeConfig(getDefaultData(), getStoreData())

      let data = {}

      if (scope === 'global') {
        data = globalData
      }
      else {
        data = mergeConfig(globalData, getStoreData(replaceIP(scope)))
      }

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

      setStoreData(cloneData, replaceIP(scope))

      this.init(scope)
    },
    reset(scope) {
      if (!scope) {
        window.appStore.reset()
      }
      else {
        const fields = getTopFields()

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
    getData(scope = this.deviceScope) {
      const value = this.init(scope)
      return value
    },

    getScrcpyData(scope = this.deviceScope) {
      const data = this.getData(scope)

      if (!data) {
        return ''
      }

      const valueList = Object.entries(data).reduce((arr, [key, value]) => {
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

      const value = valueList.join(' ')

      console.log('getScrcpyData.value', value)

      return value
    },
    getModel(path) {
      const value = get(this.model, path)
      // console.log('getModel.value', value)

      return value
    },
    setModel(path, value) {
      set(this.model, path, value)

      return this.model
    },
    resetModel(path) {
      if (!path) {
        this.model = cloneDeep(model)
        return true
      }

      set(this.model, path, cloneDeep(get(model, path)))

      return true
    },
  },
})
