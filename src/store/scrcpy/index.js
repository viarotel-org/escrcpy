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
      scope: $appStore.get('scrcpy.scope') || 'global',
      model: scrcpyModel,
      defaultConfig: getDefaultConfig(),
      config: {},
      excludeKeys: ['--record-format', 'savePath', 'adbPath', 'scrcpyPath'],
    }
  },
  actions: {
    getDefaultConfig,
    init(scope = this.scope) {
      this.config = {
        ...this.defaultConfig,
        ...($appStore.get(`scrcpy.${scope}`) || {}),
      }

      return this.config
    },
    setScope(value) {
      this.scope = value
      $appStore.set('scrcpy.scope', value)
      this.init()
    },
    getStringConfig(scope = this.scope) {
      const scopeConfig = $appStore.get(`scrcpy.${scope}`)

      if (!scopeConfig) {
        return ''
      }

      const value = Object.entries(scopeConfig)
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
    setConfig(data, scope = this.scope) {
      const pickConfig = pickBy(data, value => !!value)
      // console.log('pickConfig', pickConfig)

      $appStore.set(`scrcpy.${scope}`, pickConfig)

      this.init(scope)
    },
    getConfig(scope = this.scope) {
      const value = $appStore.get(`scrcpy.${scope}`)
      return value
    },
    getModel(key, params) {
      const handler = scrcpyModel[key]
      return handler(params)
    },
  },
})
