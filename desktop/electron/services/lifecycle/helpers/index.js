import { app as electronApp } from 'electron'
import { globalEventEmitter } from '$electron/helpers/emitter/index.js'

export * from './arguments.js'
export * from './singleton.js'

export function restoreAndFocusWindow(
  win,
) {
  if (!win || win.isDestroyed()) {
    return false
  }

  // Restore if minimized
  if (win.isMinimized()) {
    win.restore()
  }

  // Show if hidden
  if (!win.isVisible()) {
    win.show()
  }

  // Focus if requested
  win.focus()

  // Show dock on macOS if requested
  if (process.platform === 'darwin') {
    electronApp.dock.show()
  }

  // Emit tray destroy event to remove tray icon if any
  globalEventEmitter.emit('tray:destroy')

  return true
}
