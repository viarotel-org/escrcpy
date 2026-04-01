import { usePreferenceStore } from '$/store/preference/index.js'

/**
 * Save layout composable
 * Handles saving widget layout configurations
 */
export function useSaveLayout(options) {
  const { arrangedWidgets, close, getRemovedWidgets, clearRemovedWidgets } = options || {}

  const preferenceStore = usePreferenceStore()

  function saveLayout() {
    // First, handle removed widgets - clean up their configurations
    const scrcpy = window.$preload.store.get('scrcpy') || {}

    const removedWidgets = getRemovedWidgets()

    removedWidgets.forEach((widget) => {
      const scope = widget.type === 'global' ? 'global' : widget.deviceId

      const scopeConfig = { ...scrcpy[scope] || {} }
      delete scopeConfig['--window-width']
      delete scopeConfig['--window-height']
      delete scopeConfig['--window-x']
      delete scopeConfig['--window-y']

      window.$preload.store.set(['scrcpy', scope], scopeConfig)
    })

    // Then, save current widgets' configurations
    arrangedWidgets.value.forEach((widget) => {
      const rectConfig = {
        '--window-width': Math.round(widget.realWidth),
        '--window-height': Math.round(widget.realHeight),
        '--window-x': Math.round(widget.realX),
        '--window-y': Math.round(widget.realY),
      }

      const scope = widget.type === 'global' ? 'global' : widget.deviceId

      const scopeConfig = { ...scrcpy[scope] || {}, ...rectConfig }
      window.$preload.store.set(['scrcpy', scope], scopeConfig)
    })

    clearRemovedWidgets()

    preferenceStore.init()

    const totalChanges = arrangedWidgets.value.length + removedWidgets.length
    if (totalChanges === 0) {
      console.log(window.t('device.arrange.save.noChanges'))
    }
    else {
      const removedText = removedWidgets.length > 0 ? window.t('device.arrange.save.removed', { count: removedWidgets.length }) : ''
      console.log(window.t('device.arrange.save.success', { count: arrangedWidgets.value.length, removed: removedText }))
    }

    close()
  }

  return {
    saveLayout,
  }
}
