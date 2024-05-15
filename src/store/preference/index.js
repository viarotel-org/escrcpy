import { defineStore } from 'pinia'
import { cloneDeep, get, pickBy, set } from 'lodash-es'
import model from './model/index.js'

import {
  getDefaultData,
  getOtherFields,
  getStoreData,
  getTopFields,
  mergeConfig,
  setStoreData,
} from './helpers/index.js'

import { replaceIP, restoreIP } from '$/utils/index.js'

const { adbPath, scrcpyPath, gnirehtetPath } = window.electron?.configs || {}

export const usePreferenceStore = defineStore({
  id: 'app-preference',
  state() {
    const deviceScope = restoreIP(
      window.appStore.get('scrcpy.deviceScope') || 'global',
    )

    const recordKeys = Object.values(model?.record?.children || {}).map(
      item => item.field,
    )

    const cameraKeys = Object.values(model?.camera?.children || {}).map(
      item => item.field,
    )

    const otgKeys = Object.values(model?.otg?.children || {}).map(
      item => item.field,
    )

    return {
      model: cloneDeep(model),
      data: { ...getDefaultData() },
      deviceScope,
      excludeKeys: [
        '--display-overlay',
        '--camera',
        '--video-code',
        '--audio-code',
        '--keyboard-inject',
        ...getOtherFields('scrcpy'),
      ],
      recordKeys,
      cameraKeys,
      otgKeys,
    }
  },
  getters: {},
  actions: {
    getDefaultData,
    init(scope = this.deviceScope) {
      let data = mergeConfig(getDefaultData(), getStoreData())

      if (scope !== 'global') {
        data = mergeConfig(data, getStoreData(replaceIP(scope)))
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
      const pickData = pickBy(
        data,
        value => !!value || typeof value === 'number',
      )

      if (data.adbPath === adbPath) {
        delete pickData.adbPath
      }

      if (data.scrcpyPath === scrcpyPath) {
        delete pickData.scrcpyPath
      }

      if (data.gnirehtetPath === gnirehtetPath) {
        delete pickData.gnirehtetPath
      }

      setStoreData(pickData, replaceIP(scope))

      this.init(scope)
    },
    reset(scope) {
      if (!scope) {
        window.appStore.clear()
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

    getScrcpyArgs(
      scope = this.deviceScope,
      { isRecord = false, isCamera = false, isOtg = false, excludes = [] } = {},
    ) {
      const data = this.getData(scope)

      if (!data) {
        return ''
      }

      const valueList = Object.entries(data).reduce((arr, [key, value]) => {
        if (!value && typeof value !== 'number') {
          return arr
        }

        if (this.excludeKeys.includes(key)) {
          return arr
        }

        if (!isRecord) {
          if (this.recordKeys.includes(key)) {
            return arr
          }
        }

        if (!isCamera) {
          if (this.cameraKeys.includes(key)) {
            return arr
          }
        }

        if (!isOtg) {
          if (this.otgKeys.includes(key)) {
            return arr
          }
        }

        if (excludes.includes(key) || excludes.includes(`${key}=${value}`)) {
          return arr
        }

        if (typeof value === 'boolean') {
          arr.push(key)
        }
        else {
          arr.push(`${key}="${value}"`)
        }

        return arr
      }, [])

      if (this.data.scrcpyAppend) {
        valueList.push(...this.data.scrcpyAppend.split(' '))
      }

      const value = valueList.join(' ')

      return value
    },
    getModel(path) {
      const value = get(this.model, path)

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
