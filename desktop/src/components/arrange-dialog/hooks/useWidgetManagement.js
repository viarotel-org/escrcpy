/**
 * Widget management composable
 * Handles adding, removing, and managing widgets
 */
export function useWidgetManagement(
  options,
) {
  const {
    arrangedWidgets,
    allDevices,
    hasGlobalWidget,
    createWidgetFromConfig,
    screenWidth,
    screenHeight,
  } = options || {}
  // Track removed widgets for later cleanup in saveLayout
  const removedWidgets = ref([])

  // Helper function to add widget to removed list
  function markWidgetAsRemoved(widget) {
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
  function unmarkWidgetAsRemoved(widget) {
    const index = removedWidgets.value.findIndex(w =>
      w.type === widget.type
      && (widget.type === 'global' || w.deviceId === widget.deviceId),
    )
    if (index > -1) {
      removedWidgets.value.splice(index, 1)
    }
  }

  function addWidget(command) {
    const scrcpy = window.$preload.store.get('scrcpy') || {}

    if (command === 'global') {
      if (hasGlobalWidget.value) {
        ElMessage.warning(window.t('device.arrange.widget.global.exists'))
        return false
      }

      const globalConfig = scrcpy.global || {}

      const widget = createWidgetFromConfig(globalConfig, {
        id: 'global',
        type: 'global',
        name: window.t('device.arrange.widget.global.name'),
      })

      arrangedWidgets.value.push(widget)
      // Remove from removed list if it was previously removed
      unmarkWidgetAsRemoved(widget)

      return false
    }

    const device = allDevices.value.find(d => d.id === command)

    if (!device) {
      ElMessage.error(window.t('device.arrange.device.notFound'))
      return false
    }

    const deviceConfig = scrcpy[command] || {}

    const deviceScreen = scaleDeviceScreenSize(device)

    const widget = createWidgetFromConfig(deviceConfig, {
      id: device.id,
      type: 'device',
      deviceId: device.id,
      name: device.name || device.model?.split(':')[1] || device.id,
      deviceScreenWidth: deviceScreen.width ?? null,
      deviceScreenHeight: deviceScreen.height ?? null,
      lockAspectRatio: !!(device.screenWidth && device.screenHeight),
    })

    arrangedWidgets.value.push(widget)
    // Remove from removed list if it was previously removed
    unmarkWidgetAsRemoved(widget)
  }

  function removeWidget(widgetId) {
    const index = arrangedWidgets.value.findIndex(w => w.id === widgetId)
    if (index > -1) {
      const widget = arrangedWidgets.value[index]
      // Mark widget as removed for later cleanup in saveLayout
      markWidgetAsRemoved(widget)
      arrangedWidgets.value.splice(index, 1)
    }
  }

  function clearAllWidgets() {
    ElMessageBox.confirm(
      window.t('device.arrange.clear.confirm'),
      window.t('common.tips'),
      {
        type: 'warning',
      },
    ).then(() => {
      // Mark all current widgets as removed for later cleanup in saveLayout
      arrangedWidgets.value.forEach(widget => markWidgetAsRemoved(widget))
      arrangedWidgets.value = []
    }).catch(() => {})
  }

  // Methods to manage removed widgets for saveLayout
  function getRemovedWidgets() {
    return removedWidgets.value
  }

  function clearRemovedWidgets() {
    removedWidgets.value = []
  }

  function scaleDeviceScreenSize(device) {
    const sw = screenWidth?.value || 0
    const sh = screenHeight?.value || 0
    const dw = device.screenWidth ?? 0
    const dh = device.screenHeight ?? 0

    if (!sw || !sh) {
      return { width: dw, height: dh }
    }

    const scale = Math.min(sh / 2 / dh, sw / dw, 1)

    return {
      width: Math.round(dw * scale),
      height: Math.round(dh * scale),
    }
  }

  return {
    addWidget,
    removeWidget,
    clearAllWidgets,
    getRemovedWidgets,
    clearRemovedWidgets,
    scaleDeviceScreenSize,
  }
}
