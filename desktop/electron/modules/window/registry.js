/**
 * Window Registry
 * Centralized window instance management
 */

/**
 * Window registry store
 * @type {Map<string, Electron.BrowserWindow>}
 */
const windowRegistry = new Map()

/**
 * Register a window instance
 * @param {string} name - Window name identifier
 * @param {Electron.BrowserWindow} window - Window instance
 */
export function registerWindow(name, window) {
  if (!name || !window) {
    throw new Error('Window name and instance are required')
  }

  windowRegistry.set(name, window)

  // Auto cleanup on window close
  window.once('closed', () => {
    windowRegistry.delete(name)
  })
}

/**
 * Get window instance by name
 * @param {string} name - Window name identifier
 * @returns {Electron.BrowserWindow | undefined}
 */
export function getWindow(name) {
  return windowRegistry.get(name)
}

/**
 * Get main window instance
 * @returns {Electron.BrowserWindow | undefined}
 */
export function getMainWindow() {
  return getWindow('main')
}

/**
 * Check if window exists and is not destroyed
 * @param {string} name - Window name identifier
 * @returns {boolean}
 */
export function hasWindow(name) {
  const window = getWindow(name)
  return window && !window.isDestroyed()
}

/**
 * Get all registered windows
 * @returns {Map<string, Electron.BrowserWindow>}
 */
export function getAllWindows() {
  return new Map(windowRegistry)
}

/**
 * Clear all window registrations
 */
export function clearRegistry() {
  windowRegistry.clear()
}
