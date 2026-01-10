/**
 * Get device ID
 * @param {*} scope
 * @returns {string|undefined}
 */
export function getDeviceId(scope) {
  let value = scope

  if (value === 'global') {
    value = useDeviceStore().list[0]?.id
  }

  return value
}
