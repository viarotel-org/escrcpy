import { i18n } from '$/locales/index.js'
import localeModel from '$/plugins/element-plus/locale.js'

/**
 * Window state sync hook
 * @returns {Object} Window state sync instance
 */
export function useWindowStateSync(options = {}) {
  const { useDeviceSync = true } = options

  const themeStore = useThemeStore()
  const queryParams = ref({})
  const currentDevice = ref({})

  const locale = computed(() => {
    const i18nLocale = i18n.global.locale.value
    const value = localeModel[i18nLocale]
    return value
  })

  if (useDeviceSync) {
    window.electron.ipcRenderer.on('device-change', handleDeviceChange)
  }

  window.appStore.onDidChange('common.language', (value) => {
    i18n.global.locale.value = value
    options.onLanguageChange?.(value)
  })

  onMounted(() => {
    queryParams.value = Object.fromEntries(new URLSearchParams(location.search))
    options.onQueryMounted?.(queryParams.value)
  })

  onUnmounted(() => {
    window.electron.ipcRenderer.off('device-change', handleDeviceChange)
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
