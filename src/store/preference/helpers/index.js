import { cloneDeep, keyBy, mergeWith, pick, uniq } from 'lodash-es'
import model from '../model/index.js'

const topFields = getTopFields()

const modelMap = getModelMap()

const modelEntries = Object.entries(modelMap)

export function getTopFields(data = model) {
  return uniq(Object.values(data).map(item => item.field))
}

export function getModelMap(data = model) {
  const value = Object.entries(data).reduce((obj, [parentId, parentItem]) => {
    const children
      = Object.entries(parentItem?.children || {})?.map(([id, item]) => ({
        ...item,
        parentField: parentItem.field,
        parentId,
        id,
      })) || []

    const subData = keyBy(children, 'field')

    obj = {
      ...obj,
      ...subData,
    }

    return obj
  }, {})

  return value
}

export function getDefaultData(parentId, iteratee) {
  iteratee = iteratee ?? (value => value)

  const value = modelEntries.reduce((obj, [key, item]) => {
    if (!parentId || item.parentId === parentId) {
      obj[key] = iteratee(item.value)
    }
    return obj
  }, {})

  return value
}

export const getStoreData = (scope) => {
  const value = {}

  topFields.forEach((key) => {
    const storeValue = window.appStore.get(key) || {}

    if (['scrcpy'].includes(key)) {
      Object.assign(value, storeValue[scope || 'global'])
      return
    }

    Object.assign(value, storeValue)
  })

  const includeKeys = Object.keys(modelMap)

  return pick(value, includeKeys)
}

export function setStoreData(data, scope) {
  const storeModel = topFields.reduce((obj, key) => {
    obj[key] = {}
    return obj
  }, {})

  Object.entries(data).forEach(([key, value]) => {
    const { parentField } = modelMap?.[key] || {}

    if (!parentField) {
      return
    }

    storeModel[parentField][key] = value
  })

  const storeList = Object.entries(storeModel).reduce((arr, [field, value]) => {
    arr.push({
      field: field === 'scrcpy' ? ['scrcpy', scope] : field,
      value,
    })

    return arr
  }, [])

  storeList.forEach((item) => {
    window.appStore.set(item.field, item.value)
  })
}

export function mergeConfig(object, sources) {
  const cloneObject = cloneDeep(object)
  const cloneSources = cloneDeep(sources)

  const customizer = (objValue, srcValue, key) => {
    let value

    if (srcValue) {
      value = srcValue
    }
    else if (objValue) {
      value = objValue
    }

    return value
  }

  const value = mergeWith(cloneObject, cloneSources, customizer)

  return value
}

export function getScrcpyExcludeKeys() {
  const value = modelEntries.reduce((arr, [key, item]) => {
    if (item.customized || ['common'].includes(item.parentId)) {
      arr.push(key)
    }
    return arr
  }, [])

  return value
}
