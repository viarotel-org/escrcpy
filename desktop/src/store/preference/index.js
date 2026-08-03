import { cloneDeep, get, set } from 'lodash-es'
import {
  getDefaultData,
  getScrcpyExcludeKeys,
  getStoreData,
  getTopFields,
  mergePreferenceConfig,
  seedStoreDefaults,
  setStoreData,
} from './helpers/index.js'
import preferenceModel from '$/models/preference/index.js'
import command from '$/utils/command/index.js'

export const usePreferenceStore = defineStore('app-preference', () => {
  const deviceScope = ref(window.$preload.store.get('scrcpy.deviceScope') || 'global')
  const recordKeys = ref(Object.values(preferenceModel?.record?.children || {}).map((item) => {
    return item.field
  }))
  const cameraKeys = ref(Object.values(preferenceModel?.camera?.children || {}).map((item) => {
    return item.field
  }))

  const launchKeys = ref(Object.values(preferenceModel?.launch?.children || {}).map((item) => {
    return item.field
  }))

  const model = ref(cloneDeep(preferenceModel))
  const data = ref({ ...getDefaultData() })
  const scrcpyExcludeKeys = ref(getScrcpyExcludeKeys())
  const titleBarHeight = ref(0)

  window.$preload.ipcRenderer.invoke('get-primary-display').then((display) => {
    titleBarHeight.value = display.titleBarHeight
  })

  function init(scope = deviceScope.value) {
    seedStoreDefaults(scope)
    data.value = getData(scope)
    return data.value
  }

  function setScope(value) {
    deviceScope.value = value
    window.$preload.store.set('scrcpy.deviceScope', deviceScope.value)
    init()
  }

  function setData(dataToSet, scope = deviceScope.value) {
    setStoreData(dataToSet, scope)
  }

  function reset(scope) {
    if (!scope || ['global'].includes(scope)) {
      window.$preload.store.clear()
    }
    else {
      const fields = getTopFields()
      fields.forEach((key) => {
        if (key === 'scrcpy') {
          deviceScope.value = scope
          window.$preload.store.set(['scrcpy', scope], {})
          return false
        }
        window.$preload.store.set(key, {})
      })
    }
    init()
  }

  function resetDeps(type) {
    switch (type) {
      case 'adb':
        window.$preload.store.set('common.adbPath', '')
        break
      case 'scrcpy':
        window.$preload.store.set('common.scrcpyPath', '')
        break
      default:
        window.$preload.store.set('common.adbPath', '')
        window.$preload.store.set('common.scrcpyPath', '')
        break
    }
    init()
  }

  function getData(scope = deviceScope.value) {
    return mergePreferenceConfig(getDefaultData(), getStoreData(scope))
  }

  function getDataWithFallback(scope = deviceScope.value) {
    const globalData = getData('global')

    if (scope === 'global') {
      return globalData
    }

    return mergePreferenceConfig(globalData, getStoreData(scope))
  }

  function scrcpyParameter(scope = deviceScope.value, options) {
    const {
      useRecord = false,
      useCamera = false,
      useLaunch = false,
      excludes = [],
      overrides = {},
    } = options || {}

    const dataToUse = typeof scope === 'object' ? scope : getDataWithFallback(scope)

    if (!dataToUse) {
      return ''
    }

    const mergedData = { ...dataToUse, ...overrides }

    const params = Object.entries(mergedData).reduce((obj, [key, value]) => {
      const shouldExclude
        = ([null, undefined, '', false].includes(value))
          || scrcpyExcludeKeys.value.includes(key)
          || [key, `${key}=${value}`].some(v => excludes.includes(v))
          || (!useRecord && recordKeys.value.includes(key))
          || (!useCamera && cameraKeys.value.includes(key))
          || (!useLaunch && launchKeys.value.includes(key))

      if (!shouldExclude) {
        obj[key] = value
      }

      // Handle special case for window-y
      if (key === '--window-y' && typeof value !== 'undefined') {
        obj[key] = Number(value) + titleBarHeight.value
      }

      return obj
    }, {})

    if (params['--flex-display']) {
      delete params['--window-width']
      delete params['--window-height']
    }

    let value = command.stringify(params)

    const scrcpyAppend = (dataToUse.scrcpyAppend || '').replace(/\r?\n/g, ' ').trim()
    if (scrcpyAppend) {
      value += ` ${scrcpyAppend}`
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
    getDefaultData,
    init,
    setScope,
    setData,
    reset,
    resetDeps,
    getData,
    getDataWithFallback,
    scrcpyParameter,
    getModel,
    setModel,
    resetModel,
  }
})
