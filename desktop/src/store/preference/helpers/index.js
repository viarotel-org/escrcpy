import { cloneDeep, keyBy, mergeWith, pick, pickBy, uniq } from 'lodash-es'
import preferenceModel from '$/models/preference/index.js'

/**
 * Base unset values shared by all fields.
 * Values considered equivalent to "not set", used by setStoreData filtering
 * and mergePreferenceConfig fallback. Fields can declare additional unset values
 * via the schema's unset property (incremental mode).
 */
const BASE_UNSET = [undefined, null, '']

const topFields = getTopFields()

const modelMap = getModelMap()

const modelEntries = Object.entries(modelMap)

/**
 * Get the effective unset list for a field (base + field extras, deduplicated).
 * null is always treated as unset for backward compatibility with persisted values.
 */
function getFieldUnset(key) {
  const meta = modelMap[key]
  const extra = meta?.unset ?? []
  return [...new Set([...BASE_UNSET, ...extra])]
}

export function getTopFields(data = preferenceModel) {
  return uniq(Object.values(data).map(item => item.field))
}

export function getModelMap(data = preferenceModel) {
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
    const storeValue = window.$preload.store.get(key) || {}

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
    let value = item.value

    if (['common'].includes(item.field)) {
      value = {
        ...window.$preload.store.get(item.field),
        ...item.value,
      }
    }

    const pickValue = pickBy(
      value,
      (v, key) => !getFieldUnset(key).includes(v),
    )

    window.$preload.store.set(item.field, pickValue)
  })
}

/**
 * Seed effective default values into the store for keys not yet persisted.
 * Only writes keys absent from the store whose defaults are effective
 * (not unset), to avoid overwriting user values or writing empty objects.
 * Ensures the store JSON file contains all default values so that
 * main-process code (which reads the store directly without mergePreferenceConfig)
 * always gets the correct defaults.
 */
export function seedStoreDefaults(scope) {
  const defaults = getDefaultData()
  const stored = getStoreData(scope)

  const missing = Object.entries(defaults).reduce((obj, [key, value]) => {
    if (stored[key] === undefined && !getFieldUnset(key).includes(value)) {
      obj[key] = value
    }
    return obj
  }, {})

  if (Object.keys(missing).length > 0) {
    setStoreData(missing, scope)
  }
}

/**
 * Merge preference config objects, with unset values falling back to the base object.
 */
export function mergePreferenceConfig(object, sources) {
  const cloneObject = cloneDeep(object)
  const cloneSources = cloneDeep(sources)

  const customizer = (objValue, srcValue, key) => {
    const unset = getFieldUnset(key)

    if (unset.includes(srcValue)) {
      return objValue
    }

    return srcValue
  }

  return mergeWith(cloneObject, cloneSources, customizer)
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
