/**
 * Widget event handlers composable
 * Handles widget dragging and resizing events
 */
export function useWidgetEvents(scaleConverter, arrangedWidgets) {
  const updateWidgetPosition = (widget, containerPos) => {
    const realPos = scaleConverter(containerPos, true)
    widget.x = containerPos.x
    widget.y = containerPos.y
    widget.realX = realPos.x
    widget.realY = realPos.y
  }

  const updateWidgetSize = (widget, containerSize) => {
    const realSize = scaleConverter(containerSize, true)
    widget.width = containerSize.width
    widget.height = containerSize.height
    widget.realWidth = realSize.width
    widget.realHeight = realSize.height
  }

  const onWidgetDragging = (widgetId, event) => {
    const widget = arrangedWidgets.value.find(w => w.id === widgetId)
    if (widget) {
      updateWidgetPosition(widget, { x: event.x, y: event.y })
    }
  }

  const onWidgetResizing = (widgetId, event) => {
    const widget = arrangedWidgets.value.find(w => w.id === widgetId)
    if (widget) {
      updateWidgetPosition(widget, { x: event.x, y: event.y })
      updateWidgetSize(widget, { width: event.width, height: event.height })
    }
  }

  const onWidgetDragStop = (widgetId, event) => {
    onWidgetDragging(widgetId, event)
  }

  const onWidgetResizeStop = (widgetId, event) => {
    onWidgetResizing(widgetId, event)
  }

  return {
    onWidgetDragging,
    onWidgetResizing,
    onWidgetDragStop,
    onWidgetResizeStop,
  }
}
