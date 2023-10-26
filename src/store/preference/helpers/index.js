import { cloneDeep, keyBy, mergeWith, uniq } from 'lodash-es'
import model from '../model/index.js'

export function getModelFields(data = model) {
  return uniq(Object.values(data).map(item => item.field))
}

const modelFields = getModelFields()

export function getModelMap(data = model) {
  const value = Object.entries(data).reduce((obj, [key, item]) => {
    const children
      = item?.children()?.map(item_1 => ({
        ...item_1,
        parentField: item.field,
        parentId: key,
      })) || []

    const subData = keyBy(children, 'field')

    obj = {
      ...obj,
      ...subData,
    }

    return obj
  }, {})

  // console.raw('getModelMap.value', value)

  return value
}

export function getDefaultData(parentId) {
  const modelMap = getModelMap()

  const value = Object.entries(modelMap).reduce((obj, [key, data]) => {
    if (!parentId || data.parentId === parentId) {
      obj[key] = data.value
    }
    return obj
  }, {})

  // console.raw('getDefaultData.value', value)

  return value
}

export const getStoreData = (scope) => {
  const value = {}

  modelFields.forEach((key) => {
    const storeValue = window.appStore.get(key) || {}
    if (key === 'scrcpy') {
      Object.assign(value, storeValue[scope || 'global'])
      return
    }

    Object.assign(value, storeValue)
  })

  // console.raw('getStoreData.value', value)

  return value
}

export function setStoreData(data, scope) {
  const modelMap = getModelMap()

  const fieldModel = modelFields.reduce((obj, key) => {
    obj[key] = {}
    return obj
  }, {})

  Object.entries(data).forEach(([key, value]) => {
    const { parentField } = modelMap[key]

    fieldModel[parentField][key] = value
  })

  const fieldList = Object.entries(fieldModel).reduce((arr, [field, value]) => {
    arr.push({
      field: field === 'scrcpy' ? `scrcpy.${scope}` : field,
      value,
    })
    return arr
  }, [])

  // console.raw('setStoreData.fieldList', fieldList)

  fieldList.forEach((item) => {
    window.appStore.set(item.field, item.value)
  })
}

export function mergeConfig(object, sources, { debug = false } = {}) {
  const cloneObject = cloneDeep(object)
  const cloneSources = cloneDeep(sources)

  const customizer = (objValue, srcValue, key) => {
    let value = srcValue || objValue

    if (typeof srcValue === 'boolean') {
      value = srcValue
    }

    if (debug) {
      console.raw(key, value)
    }

    return value
  }

  const value = mergeWith(cloneObject, cloneSources, customizer)

  return value
}

export const getOtherFields = (excludeKey = '') => {
  const modelMap = getModelMap()
  const value = Object.entries(modelMap).reduce((arr, [key, data]) => {
    if (data.parentField !== excludeKey) {
      arr.push(data.field)
    }
    return arr
  }, [])

  return value
}
