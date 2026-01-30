import { app as electronApp } from 'electron'
import { globalEventEmitter } from '$electron/helpers/emitter/index.js'

export * from './arguments.js'
export * from './singleton.js'

export function restoreAndFocusWindow(
  win,
  options = {},
) {
  if (!win || win.isDestroyed()) {
    return false
  }

  const { forceFocus = true, showDock = process.platform === 'darwin' } = options

  // Restore if minimized
  if (win.isMinimized()) {
    win.restore()
  }

  // Show if hidden
  if (!win.isVisible()) {
    win.show()
  }

  // Focus if requested
  if (forceFocus) {
    win.focus()
  }

  // Show dock on macOS if requested
  if (showDock && process.platform === 'darwin') {
    electronApp.dock.show()
  }

  globalEventEmitter.emit('tray:destroy')

  return true
}
