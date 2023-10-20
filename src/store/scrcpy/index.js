import { defineStore } from 'pinia'
import { cloneDeep, mergeWith } from 'lodash-es'
import * as scrcpyModel from './model/index.js'
import { replaceIP } from '@/utils/index.js'

const $appStore = window.appStore

function mergeConfig(object, sources, { debug = false } = {}) {
  const customizer = (objValue, srcValue) => {
    if (debug) {
      console.log('objValue', typeof objValue)
      console.log('srcValue', typeof srcValue)
    }

    if (typeof srcValue === 'boolean') {
      return srcValue
    }

    return srcValue || objValue
  }

  const value = mergeWith(cloneDeep(object), cloneDeep(sources), customizer)

  return value
}

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
    replaceIP,
    getDefaultConfig,
    init(scope = this.scope) {
      let tempConfig = mergeConfig(
        this.defaultConfig,
        $appStore.get('scrcpy.global') || {},
      )

      if (scope !== 'global') {
        const scopeConfig = $appStore.get(`scrcpy.${replaceIP(scope)}`) || {}
        tempConfig = mergeConfig(tempConfig, scopeConfig)
      }

      this.config = tempConfig

      return this.config
    },
    reset(scope) {
      if (scope) {
        this.scope = scope
        $appStore.set(`scrcpy.${replaceIP(scope)}`, {})
      }
      else {
        this.scope = 'global'
        $appStore.set('scrcpy', {})
      }

      this.init()
    },
    setScope(value) {
      this.scope = replaceIP(value)
      $appStore.set('scrcpy.scope', this.scope)
      this.init()
    },
    getStringConfig(scope = this.scope) {
      const config = this.getConfig(scope)

      if (!config) {
        return ''
      }

      const value = Object.entries(config)
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
      $appStore.set(`scrcpy.${replaceIP(scope)}`, { ...data })

      this.init(scope)
    },
    getConfig(scope = this.scope) {
      const value = this.init(scope)
      return value
    },
    getModel(key, params) {
      const handler = scrcpyModel[key]
      return handler(params)
    },
  },
})
