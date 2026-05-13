export function getPackageName(item = {}) {
  return item.packageName || item.value || 'unknown'
}

export function getLaunchKey(item = {}) {
  const userId = item.userId || 0
  const packageName = getPackageName(item)
  const parts = [userId, packageName]

  return parts.join('_')
}

export function parseLaunchItem(item = {}) {
  const deviceId = item.deviceId
  const itemKey = getLaunchKey(item)
  const scope = item.scope

  return {
    deviceId,
    itemKey,
    scope,
  }
}

export function getLaunchConfig(item) {
  const value = item.store || window.$preload.store.get('launch')

  const { deviceId, itemKey, scope } = parseLaunchItem(item)

  return value?.[deviceId]?.[itemKey]?.[scope]
}

export function setLaunchConfig(item, value) {
  const { deviceId, itemKey, scope } = parseLaunchItem(item)

  window.$preload.store.set(['launch', deviceId, itemKey, scope], value)
}
