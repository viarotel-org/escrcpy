/**
 * Layout management composable
 * Handles loading and creating widget layouts
 */
export function useLayoutManagement(options) {
  const {
    screenWidth,
    screenHeight,
    scaleConverter,
    arrangedWidgets,
    allDevices,
  } = options

  const createWidgetFromConfig = (config = {}, widgetData = {}) => {
    const realWidth = Number(config['--window-width']) || widgetData.deviceScreenWidth || screenWidth.value / 6
    const realHeight = Number(config['--window-height']) || widgetData.deviceScreenHeight || screenHeight.value / 2
    const realX = Number(config['--window-x']) || arrangedWidgets.value.length * 50
    const realY = Number(config['--window-y']) || arrangedWidgets.value.length * 50
    const lockAspectRatio = widgetData.lockAspectRatio ?? false

    const containerRect = scaleConverter({ width: realWidth, height: realHeight, x: realX, y: realY })

    return {
      ...widgetData,
      x: containerRect.x,
      y: containerRect.y,
      width: containerRect.width,
      height: containerRect.height,
      realX,
      realY,
      realWidth,
      realHeight,
      lockAspectRatio,
    }
  }

  const loadLayout = () => {
    arrangedWidgets.value = []
    const scrcpy = window.$preload.store.get('scrcpy')

    // Load global widget
    const globalConfig = scrcpy.global || {}
    if (globalConfig['--window-width'] && globalConfig['--window-height']) {
      const widget = createWidgetFromConfig(globalConfig, {
        id: 'global',
        type: 'global',
        name: 'Global',
      })
      arrangedWidgets.value.push(widget)
    }

    // Load device widgets
    allDevices.value.forEach((device) => {
      const deviceConfig = scrcpy[device.id] || {}
      if (deviceConfig['--window-width'] && deviceConfig['--window-height']) {
        const widget = createWidgetFromConfig(deviceConfig, {
          id: device.id,
          type: 'device',
          deviceId: device.id,
          name: device.name || device.model?.split(':')[1] || device.id,
          lockAspectRatio: !!(device.screenWidth && device.screenHeight),
        })
        arrangedWidgets.value.push(widget)
      }
    })
  }

  // Recalculate the proportion of all widgets
  function updateLayout() {
    if (!arrangedWidgets.value.length) {
      return false
    }

    arrangedWidgets.value.forEach((widget) => {
      const containerRect = scaleConverter({
        x: widget.realX,
        y: widget.realY,
        width: widget.realWidth,
        height: widget.realHeight,
      })

      widget.x = containerRect.x
      widget.y = containerRect.y
      widget.width = containerRect.width
      widget.height = containerRect.height
    })
  }

  return {
    createWidgetFromConfig,
    loadLayout,
    updateLayout,
  }
}
