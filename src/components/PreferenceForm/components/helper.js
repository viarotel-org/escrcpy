/**
 * 获取设备ID
 * @param {*} scope
 * @returns
 */
export function getDeviceId(scope) {
  let value = scope

  if (value === 'global') {
    value = useDeviceStore().list[0]?.id
  }

  return value
}
