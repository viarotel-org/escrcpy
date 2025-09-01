import { ref } from 'vue'
import { t } from '$/locales/index.js'

/**
 * Widget management composable
 * Handles adding, removing, and managing widgets
 */
export function useWidgetManagement(
  arrangedWidgets,
  allDevices,
  hasGlobalWidget,
  createWidgetFromConfig,
  screenWidth,
  screenHeight,
) {
  // Track removed widgets for later cleanup in saveLayout
  const removedWidgets = ref([])

  // Helper function to add widget to removed list
  const markWidgetAsRemoved = (widget) => {
    // Avoid duplicates
    const exists = removedWidgets.value.some(w =>
      w.type === widget.type
      && (widget.type === 'global' || w.deviceId === widget.deviceId),
    )
    if (!exists) {
      removedWidgets.value.push({
        type: widget.type,
        deviceId: widget.deviceId,
        id: widget.id,
      })
    }
  }

  // Helper function to remove widget from removed list (if re-added)
  const unmarkWidgetAsRemoved = (widget) => {
    const index = removedWidgets.value.findIndex(w =>
      w.type === widget.type
      && (widget.type === 'global' || w.deviceId === widget.deviceId),
    )
    if (index > -1) {
      removedWidgets.value.splice(index, 1)
    }
  }
  const addWidget = (command) => {
    const scrcpy = window.appStore.get('scrcpy') || {}
    const globalConfig = scrcpy.global || {}

    if (command === 'global') {
      if (hasGlobalWidget.value) {
        ElMessage.warning(t('device.arrange.widget.global.exists'))
        return
      }

      const config = {
        '--window-width': globalConfig['--window-width'] || screenWidth.value / 6,
        '--window-height': globalConfig['--window-height'] || screenHeight.value / 2,
        '--window-x': globalConfig['--window-x'] || (arrangedWidgets.value.length * 50).toString(),
        '--window-y': globalConfig['--window-y'] || (arrangedWidgets.value.length * 50).toString(),
      }

      const widget = createWidgetFromConfig(config, {
        id: 'global',
        type: 'global',
        name: t('device.arrange.widget.global.name'),
      })

      arrangedWidgets.value.push(widget)
      // Remove from removed list if it was previously removed
      unmarkWidgetAsRemoved(widget)

      return false
    }

    const device = allDevices.value.find(d => d.id === command)
    if (!device) {
      ElMessage.error(t('device.arrange.device.notFound'))
      return
    }

    const deviceConfig = scrcpy[command] || {}

    const config = {
      ...deviceConfig,
      '--window-width': deviceConfig['--window-width'] || screenWidth.value / 6,
      '--window-height': deviceConfig['--window-height'] || screenHeight.value / 2,
      '--window-x': deviceConfig['--window-x'] || (arrangedWidgets.value.length * 50).toString(),
      '--window-y': deviceConfig['--window-y'] || (arrangedWidgets.value.length * 50).toString(),
    }

    const widget = createWidgetFromConfig(config, {
      id: device.id,
      type: 'device',
      deviceId: device.id,
      name: device.name || device.model?.split(':')[1] || device.id,
    })

    arrangedWidgets.value.push(widget)
    // Remove from removed list if it was previously removed
    unmarkWidgetAsRemoved(widget)
  }

  const removeWidget = (widgetId) => {
    const index = arrangedWidgets.value.findIndex(w => w.id === widgetId)
    if (index > -1) {
      const widget = arrangedWidgets.value[index]
      // Mark widget as removed for later cleanup in saveLayout
      markWidgetAsRemoved(widget)
      arrangedWidgets.value.splice(index, 1)
    }
  }

  const clearAllWidgets = () => {
    ElMessageBox.confirm(
      t('device.arrange.clear.confirm'),
      t('device.arrange.clear.title'),
      {
        type: 'warning',
      },
    ).then(() => {
      // Mark all current widgets as removed for later cleanup in saveLayout
      arrangedWidgets.value.forEach(widget => markWidgetAsRemoved(widget))
      arrangedWidgets.value = []
      ElMessage.success(t('device.arrange.clear.success'))
    }).catch(() => {})
  }

  // Methods to manage removed widgets for saveLayout
  const getRemovedWidgets = () => removedWidgets.value
  const clearRemovedWidgets = () => {
    removedWidgets.value = []
  }

  return {
    addWidget,
    removeWidget,
    clearAllWidgets,
    getRemovedWidgets,
    clearRemovedWidgets,
  }
}
