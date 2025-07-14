import { cloneDeep, get, pickBy, set } from 'lodash-es'
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

export const usePreferenceStore = defineStore('app-preference', () => {
  // 定义响应式状态
  const deviceScope = ref(window.appStore.get('scrcpy.deviceScope') || 'global')
  const recordKeys = ref(Object.values(model?.record?.children || {}).map((item) => {
    return item.field
  }))
  const cameraKeys = ref(Object.values(model?.camera?.children || {}).map((item) => {
    return item.field
  }))
  const otgKeys = ref(Object.values(model?.otg?.children || {}).map((item) => {
    return item.field
  }))
  const modelRef = ref(cloneDeep(model))
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
    const pickData = pickBy(
      dataToSet,
      (value) => {
        return !['', void 0].includes(value)
      },
    )

    if (dataToSet.adbPath === adbPath) {
      delete pickData.adbPath
    }

    if (dataToSet.scrcpyPath === scrcpyPath) {
      delete pickData.scrcpyPath
    }

    if (dataToSet.gnirehtetPath === gnirehtetPath) {
      delete pickData.gnirehtetPath
    }

    setStoreData(pickData, scope)
    init(scope)
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
    return get(modelRef.value, path)
  }

  function setModel(path, value) {
    set(modelRef.value, path, value)
    return modelRef.value
  }

  function resetModel(path) {
    if (!path) {
      modelRef.value = cloneDeep(model)
      return true
    }
    set(modelRef.value, path, cloneDeep(get(model, path)))
    return true
  }

  init()

  return {
    model: modelRef,
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
