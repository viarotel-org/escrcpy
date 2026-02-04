import localeModel from '$/plugins/element-plus/locale.js'

/**
 * Window state sync hook
 * @returns {Object} Window state sync instance
 */
export function useWindowStateSync(options = {}) {
  const { deviceSync = false } = options

  const { language } = useI18n()
  const themeStore = useThemeStore()

  const queryParams = ref({})
  const currentDevice = ref({})

  const locale = computed(() => {
    const value = localeModel[language.value]
    return value
  })

  if (deviceSync) {
    window.$preload.ipcRenderer?.on?.('device-change', handleDeviceChange)
  }

  if (options.onLanguageChange) {
    watch(() => language.value, (val) => {
      options.onLanguageChange?.(val)
    })
  }

  onMounted(() => {
    queryParams.value = Object.fromEntries(new URLSearchParams(location.search))
    options.onQueryMounted?.(queryParams.value)
  })

  onUnmounted(() => {
    if (deviceSync) {
      window.$preload.ipcRenderer?.off?.('device-change', handleDeviceChange)
    }
  })

  function getSize(grid) {
    const value = ['sm', 'md'].includes(grid.breakpoint) ? 'small' : 'default'

    return value
  }

  function handleDeviceChange(event, data) {
    currentDevice.value = data
    options.onDeviceChange?.(data)
  }

  return {
    themeStore,
    queryParams,
    locale,
    getSize,
    currentDevice,
  }
}
