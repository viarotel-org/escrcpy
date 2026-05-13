import { getLaunchKey, setLaunchConfig } from '$/utils/launch/index.js'

export function useLaunchOrientation({ getDeviceId, lazy = false } = {}) {
  const selections = ref({})

  onMounted(() => {
    if (!lazy) {
      init()
    }
  })

  function isEnabled(item = {}) {
    const key = getLaunchKey(item)

    if (typeof selections.value[key] !== 'undefined') {
      return Boolean(selections.value[key])
    }

    return false
  }

  function setEnabled(item = {}, value = false) {
    const enabled = Boolean(value)

    selections.value[getLaunchKey(item)] = enabled
    setLaunchConfig({ ...item, deviceId: getDeviceId?.(), scope: 'landscape' }, enabled)
  }

  function init() {
    const launchStore = window.$preload.store.get('launch')
    const launchDeviceStore = launchStore?.[getDeviceId?.()] || {}

    selections.value = Object.entries(launchDeviceStore).reduce((obj, [key, value]) => {
      obj[key] = Boolean(value.landscape)
      return obj
    }, {})
  }

  return reactive({
    init,
    selections,
    getLaunchKey,
    isEnabled,
    setEnabled,
  })
}

export default useLaunchOrientation
