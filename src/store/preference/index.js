import { cloneDeep, get, pickBy, set } from 'lodash-es'

import { defineStore } from 'pinia'

import {
  getDefaultData,
  getScrcpyExcludeKeys,
  getStoreData,
  getTopFields,
  mergeConfig,
  setStoreData,
} from './helpers/index.js'
import model from './model/index.js'

import command from '$/utils/command/index.js'

const { adbPath, scrcpyPath, gnirehtetPath } = window.electron?.configs || {}

export const usePreferenceStore = defineStore({
  id: 'app-preference',
  state() {
    const deviceScope = window.appStore.get('scrcpy.deviceScope') || 'global'

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

      scrcpyExcludeKeys: getScrcpyExcludeKeys(),
      recordKeys,
      cameraKeys,
      otgKeys,
    }
  },
  getters: {},
  actions: {
    getDefaultData,

    init(scope = this.deviceScope) {
      this.data = this.getData(scope)
      return this.data
    },
    setScope(value) {
      this.deviceScope = value
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

      setStoreData(pickData, scope)

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
            window.appStore.set(['scrcpy', 'scope'], {})
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
      let value = mergeConfig(getDefaultData(), getStoreData())

      if (scope !== 'global') {
        value = mergeConfig(value, getStoreData(scope))
      }

      return value
    },

    scrcpyParameter(
      scope = this.deviceScope,
      { isRecord = false, isCamera = false, isOtg = false, excludes = [] } = {},
    ) {
      const data = typeof scope === 'object' ? scope : this.getData(scope)

      if (!data) {
        return ''
      }

      const params = Object.entries(data).reduce((obj, [key, value]) => {
        const shouldExclude
          = (!value && typeof value !== 'number')
          || this.scrcpyExcludeKeys.includes(key)
          || (!isRecord && this.recordKeys.includes(key))
          || (!isCamera && this.cameraKeys.includes(key))
          || (!isOtg && this.otgKeys.includes(key))
          || excludes.includes(key)
          || excludes.includes(`${key}=${value}`)

        if (shouldExclude) {
          return obj
        }

        obj[key] = value

        return obj
      }, {})

      let value = command.stringify(params)

      if (data.scrcpyAppend) {
        value += ` ${data.scrcpyAppend}`
      }

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
