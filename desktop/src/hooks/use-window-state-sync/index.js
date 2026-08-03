import localeModel from '$/plugins/element-plus/locale.js'
import { useGrid } from 'vue-screen'

/**
 * Window state sync hook
 * @returns {Object} Window state sync instance
 */
export function useWindowStateSync(options = {}) {
  const { deviceSync = false } = options

  const { language } = useI18n()
  const themeStore = useThemeStore()
  const grid = useGrid()

  const queryParams = ref({ ...window.$preload.payload?.query ?? {} })
  const currentDevice = ref({ ...window.$preload.payload?.device ?? {} })

  const locale = computed(() => {
    const value = localeModel[language.value]
    return value
  })

  const size = computed(() => {
    const value = ['sm', 'md'].includes(grid.breakpoint) ? 'small' : 'default'
    return value
  })

  if (deviceSync) {
    window.$preload.ipcRenderer?.on?.('device-change', handleDeviceChange)
  }

  if (options.onLanguageChange) {
    watch(() => language.value, (val) => {
      options.onLanguageChange?.(val)
    }, {
      immediate: true,
    })
  }

  onMounted(() => {
    options.onQueryMounted?.(queryParams.value)
  })

  onUnmounted(() => {
    if (deviceSync) {
      window.$preload.ipcRenderer?.off?.('device-change', handleDeviceChange)
    }
  })

  function handleDeviceChange(event, data) {
    currentDevice.value = data
    options.onDeviceChange?.(data)
  }

  return {
    themeStore,
    queryParams,
    locale,
    size,
    currentDevice,
  }
}
