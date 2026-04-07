/**
 * Auto arrange composable
 * Computes grid-based layout for device widgets with aspect-ratio-preserving scaling.
 * Global widgets are never touched.
 */
export function useAutoArrange(options) {
  const {
    arrangedWidgets,
    allDevices,
    availableDevices,
    screenWidth,
    screenHeight,
    createWidgetFromConfig,
  } = options

  /**
   * Arrange devices into a cols × rows grid.
   *
   * Target selection:
   *   - Canvas has no device widgets → arrange all availableDevices (not yet placed)
   *   - Canvas already has device widgets → re-arrange only those devices in place
   *
   * Overflow: devices beyond cols × rows capacity are silently ignored.
   * Global widgets are never touched.
   *
   * @param {number} cols - Number of columns
   * @param {number} rows - Number of rows
   */
  async function autoArrange(cols, rows) {
    const sw = screenWidth.value
    const sh = screenHeight.value

    if (!sw || !sh) {
      ElMessage.warning(window.t('device.arrange.auto.noDevices'))
      return
    }

    // Determine target device list based on current canvas state
    const existingDeviceWidgets = arrangedWidgets.value.filter(w => w.type === 'device')
    const hasExistingDevices = existingDeviceWidgets.length > 0

    let targetDevices
    if (hasExistingDevices) {
      // Re-arrange devices already on canvas; look them up in allDevices for screen info
      targetDevices = existingDeviceWidgets.map((widget) => {
        return allDevices.value.find(d => d.id === widget.deviceId) ?? {
          id: widget.deviceId,
          name: widget.name,
          screenWidth: null,
          screenHeight: null,
        }
      })
    }
    else {
      // Canvas is empty — arrange all devices not yet placed
      targetDevices = availableDevices.value
    }

    if (!targetDevices.length) {
      ElMessage.warning(window.t('device.arrange.auto.noDevices'))
      return
    }

    // Remove all existing device widgets; preserve global
    arrangedWidgets.value = arrangedWidgets.value.filter(w => w.type !== 'device')

    // Yield to Vue so that removed VueDraggableResizable instances are fully
    // unmounted before new ones with the same keys are mounted.
    // Without this, Vue patches (reuses) the same component instance and the
    // library's internal position state from the previous layout leaks into the
    // new one, causing inconsistent results when switching layouts.
    await nextTick()

    const capacity = cols * rows
    // Devices beyond capacity are silently dropped
    const targets = targetDevices.slice(0, capacity)

    const cellRealW = sw / cols
    const cellRealH = sh / rows

    targets.forEach((device, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)

      const dw = device.screenWidth ?? 0
      const dh = device.screenHeight ?? 0

      let realW
      let realH

      if (dw > 0 && dh > 0) {
        // Preserve device aspect ratio, scale to fit inside the cell
        const scale = Math.min(cellRealW / dw, cellRealH / dh)
        realW = Math.round(dw * scale)
        realH = Math.round(dh * scale)
      }
      else {
        // No screen info: fill 80% of the cell
        realW = Math.round(cellRealW * 0.8)
        realH = Math.round(cellRealH * 0.8)
      }

      // Center the device rect inside the cell
      const realX = Math.round(col * cellRealW + (cellRealW - realW) / 2)
      const realY = Math.round(row * cellRealH + (cellRealH - realH) / 2)

      const widget = createWidgetFromConfig(
        {
          '--window-width': realW,
          '--window-height': realH,
          '--window-x': realX,
          '--window-y': realY,
        },
        {
          id: device.id,
          type: 'device',
          deviceId: device.id,
          name: device.name || device.model?.split(':')[1] || device.id,
          deviceScreenWidth: realW,
          deviceScreenHeight: realH,
          lockAspectRatio: !!(dw && dh),
        },
      )

      arrangedWidgets.value.push(widget)
    })
  }

  return { autoArrange }
}
