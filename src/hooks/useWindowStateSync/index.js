import { i18n } from '$/locales/index.js'
import localeModel from '$/plugins/element-plus/locale.js'
/**
 * 窗口状态同步 Hook
 * @returns {Object} 窗口状态同步实例
 */
export function useWindowStateSync(options = {}) {
  const themeStore = useThemeStore()
  const currentDevice = ref('')

  const locale = computed(() => {
    const i18nLocale = i18n.global.locale.value
    const value = localeModel[i18nLocale]
    return value
  })

  function init() {
    window.electron.ipcRenderer.on('device-change', (event, data) => {
      currentDevice.value = data
      options.onDeviceChange?.(data)
    })

    window.appStore.onDidChange('common.language', (value) => {
      i18n.global.locale.value = value
      options.onLanguageChange?.(value)
    })
  }

  return {
    init,
    locale,
    currentDevice,
    themeStore,
  }
}
