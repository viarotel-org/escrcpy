import { defineStore } from 'pinia'
import storage from '@renderer/utils/storages'
import { cloneDeep } from 'lodash-es'
import * as model from './model/index.js'

export const useScrcpyStore = defineStore({
  id: 'app-scrcpy',
  state() {
    return {
      model,
      config: storage.get('scrcpyConfig'),
      excludeKeys: ['--record', '--record-format'],
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

      console.log('stringifyConfig.value', value)

      return value
    },
  },
  actions: {
    init() {
      this.config = this.config || this.getDefaultConfig()
      return this.config
    },
    updateConfig(value) {
      this.config = cloneDeep(value)
      storage.set('scrcpyConfig', this.config)
    },
    getModel(key, params) {
      const handler = this.model[key]
      return handler(params)
    },
    getDefaultConfig(type) {
      const model = []
      if (type) {
        const handler = this.model[type]
        model.push(...handler())
      }
      else {
        // console.log('scrcpyModel', scrcpyModel)
        const values = Object.values(this.model)
        model.push(...values.flatMap(handler => handler()))
      }

      const value = model.reduce((obj, item) => {
        const { field, value } = item
        obj[field] = value
        return obj
      }, {})

      return value
    },
  },
})
