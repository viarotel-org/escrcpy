import { ipcMain } from 'electron'
import { initExplorerWindow } from './helpers/index.js'
import { isWindowDestroyed } from '$electron/helpers/index.js'
import * as events from './events/index.js'

export default (mainWindow) => {
  // Store file explorer windows per device
  const explorerWindows = new Map()

  ipcMain.handle('open-explorer-window', (event, data) => {
    const deviceId = data?.id

    // Check whether a file explorer window already exists for the device
    let explorerWindow = explorerWindows.get(deviceId)

    if (!isWindowDestroyed(explorerWindow)) {
      explorerWindow.show()
      return false
    }

    // Create a new file explorer window
    explorerWindow = initExplorerWindow(mainWindow, data)

    events.install(explorerWindow)

    // Store window reference
    explorerWindows.set(deviceId, explorerWindow)

    // Clean up reference on window closed
    explorerWindow.on('closed', () => {
      explorerWindows.delete(deviceId)
      explorerWindow = void 0
    })

    explorerWindow.show()

    return true
  })

  ipcMain.handle('close-explorer-window', (event, data) => {
    const deviceId = data?.id
    const explorerWindow = explorerWindows.get(deviceId)

    if (isWindowDestroyed(explorerWindow)) {
      return false
    }

    explorerWindow.close()
    explorerWindows.delete(deviceId)

    return true
  })
}
