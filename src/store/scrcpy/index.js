import { defineStore } from 'pinia'
import { pickBy } from 'lodash-es'
import * as scrcpyModel from './model/index.js'

const $appStore = window.appStore

/**
 * 获取 Scrcpy 默认配置
 */
function getDefaultConfig(type) {
  const model = []
  if (type) {
    const handler = scrcpyModel[type]
    model.push(...handler())
  }
  else {
    // console.log('scrcpyModel', scrcpyModel)
    const values = Object.values(scrcpyModel)
    model.push(...values.flatMap(handler => handler()))
  }

  const value = model.reduce((obj, item) => {
    const { field, value } = item
    obj[field] = value
    return obj
  }, {})

  return value
}

export const useScrcpyStore = defineStore({
  id: 'app-scrcpy',
  state() {
    return {
      model: scrcpyModel,
      defaultConfig: getDefaultConfig(),
      config: {},
      excludeKeys: ['--record-format', 'savePath', 'adbPath', 'scrcpyPath'],
    }
  },
  getters: {
    stringConfig() {
      if (!this.config) {
        return ''
      }

      const value = Object.entries(this.config)
        .reduce((arr, [key, value]) => {
          if (!value) {
            return arr
          }

          if (this.excludeKeys.includes(key)) {
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

      // console.log('stringifyConfig.value', value)

      return value
    },
  },
  actions: {
    getDefaultConfig,
    init() {
      this.config = {
        ...this.defaultConfig,
        ...($appStore.get('scrcpy') || {}),
      }

      return this.config
    },
    setConfig(data) {
      const pickConfig = pickBy(data, value => !!value)

      // console.log('pickConfig', pickConfig)

      $appStore.set('scrcpy', pickConfig)

      this.init()
    },
    getModel(key, params) {
      const handler = scrcpyModel[key]
      return handler(params)
    },
  },
})
