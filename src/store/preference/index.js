import { cloneDeep, get, set } from 'lodash-es'
import {
  getDefaultData,
  getScrcpyExcludeKeys,
  getStoreData,
  getTopFields,
  mergeConfig,
  setStoreData,
} from './helpers/index.js'
import preferenceModel from '$/models/preference/index.js'
import command from '$/utils/command/index.js'

export const usePreferenceStore = defineStore('app-preference', () => {
  // 定义响应式状态
  const deviceScope = ref(window.appStore.get('scrcpy.deviceScope') || 'global')
  const recordKeys = ref(Object.values(preferenceModel?.record?.children || {}).map((item) => {
    return item.field
  }))
  const cameraKeys = ref(Object.values(preferenceModel?.camera?.children || {}).map((item) => {
    return item.field
  }))
  const otgKeys = ref(Object.values(preferenceModel?.otg?.children || {}).map((item) => {
    return item.field
  }))
  const model = ref(cloneDeep(preferenceModel))
  const data = ref({ ...getDefaultData() })
  const scrcpyExcludeKeys = ref(getScrcpyExcludeKeys())

  function init(scope = deviceScope.value) {
    data.value = getData(scope)
    return data.value
  }

  function setScope(value) {
    deviceScope.value = value
    window.appStore.set('scrcpy.deviceScope', deviceScope.value)
    init()
  }

  function setData(dataToSet, scope = deviceScope.value) {
    setStoreData(dataToSet, scope)
  }

  function reset(scope) {
    if (!scope || ['global'].includes(scope)) {
      window.appStore.clear()
    }
    else {
      const fields = getTopFields()
      fields.forEach((key) => {
        if (key === 'scrcpy') {
          deviceScope.value = scope
          window.appStore.set(['scrcpy', scope], {})
          return false
        }
        window.appStore.set(key, {})
      })
    }
    init()
  }

  function resetDeps(type) {
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
    init()
  }

  function getData(scope = deviceScope.value) {
    let value = mergeConfig(getDefaultData(), getStoreData())
    if (scope !== 'global') {
      value = mergeConfig(value, getStoreData(scope))
    }
    return value
  }

  function scrcpyParameter(
    scope = deviceScope.value,
    { isRecord = false, isCamera = false, isOtg = false, excludes = [] } = {},
  ) {
    const dataToUse = typeof scope === 'object' ? scope : getData(scope)
    if (!dataToUse) {
      return ''
    }
    const params = Object.entries(dataToUse).reduce((obj, [key, value]) => {
      const shouldExclude
        = (!value && typeof value !== 'number')
          || scrcpyExcludeKeys.value.includes(key)
          || (!isRecord && recordKeys.value.includes(key))
          || (!isCamera && cameraKeys.value.includes(key))
          || (!isOtg && otgKeys.value.includes(key))
          || excludes.includes(key)
          || excludes.includes(`${key}=${value}`)
      if (!shouldExclude) {
        obj[key] = value
      }
      return obj
    }, {})
    let value = command.stringify(params)
    if (dataToUse.scrcpyAppend) {
      value += ` ${dataToUse.scrcpyAppend}`
    }
    return value
  }

  function getModel(path) {
    return get(model.value, path)
  }

  function setModel(path, value) {
    set(model.value, path, value)
    return model.value
  }

  function resetModel(path) {
    if (!path) {
      model.value = cloneDeep(preferenceModel)
      return true
    }
    set(model.value, path, cloneDeep(get(preferenceModel, path)))
    return true
  }

  init()

  return {
    model,
    data,
    deviceScope,
    scrcpyExcludeKeys,
    recordKeys,
    cameraKeys,
    otgKeys,
    getDefaultData,
    init,
    setScope,
    setData,
    reset,
    resetDeps,
    getData,
    scrcpyParameter,
    getModel,
    setModel,
    resetModel,
  }
})
