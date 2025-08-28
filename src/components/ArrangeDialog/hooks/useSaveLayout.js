import { t } from '$/locales/index.js'
import { usePreferenceStore } from '$/store/preference/index.js'

/**
 * Save layout composable
 * Handles saving widget layout configurations
 */
export function useSaveLayout(arrangedWidgets, close, getRemovedWidgets, clearRemovedWidgets) {
  const preferenceStore = usePreferenceStore()

  const saveLayout = () => {
    // First, handle removed widgets - clean up their configurations
    const scrcpy = window.appStore.get('scrcpy') || {}

    const removedWidgets = getRemovedWidgets()

    removedWidgets.forEach((widget) => {
      const scope = widget.type === 'global' ? 'global' : widget.deviceId

      const scopeConfig = { ...scrcpy[scope] || {} }
      delete scopeConfig['--window-width']
      delete scopeConfig['--window-height']
      delete scopeConfig['--window-x']
      delete scopeConfig['--window-y']

      window.appStore.set(['scrcpy', scope], scopeConfig)
    })

    // Then, save current widgets' configurations
    arrangedWidgets.value.forEach((widget) => {
      const rectConfig = {
        '--window-width': Math.round(widget.realWidth).toString(),
        '--window-height': Math.round(widget.realHeight).toString(),
        '--window-x': Math.round(widget.realX).toString(),
        '--window-y': Math.round(widget.realY).toString(),
      }

      const scope = widget.type === 'global' ? 'global' : widget.deviceId

      const scopeConfig = { ...scrcpy[scope] || {}, ...rectConfig }
      window.appStore.set(['scrcpy', scope], scopeConfig)
    })

    // Clear the removed widgets list
    clearRemovedWidgets()

    preferenceStore.init()

    const totalChanges = arrangedWidgets.value.length + removedWidgets.length
    if (totalChanges === 0) {
      ElMessage.warning(t('device.arrange.save.noChanges'))
    }
    else {
      const removedText = removedWidgets.length > 0 ? t('device.arrange.save.removed', { count: removedWidgets.length }) : ''
      ElMessage.success(t('device.arrange.save.success', { count: arrangedWidgets.value.length, removed: removedText }))
    }

    close()
  }

  return {
    saveLayout,
  }
}
