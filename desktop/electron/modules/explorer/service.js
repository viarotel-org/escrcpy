import { ipcMain } from 'electron'
import { isWindowDestroyed } from '$electron/helpers/index.js'
import { installWindowEvents } from './events.js'

export default (app) => {
  const manager = app.getWindowManager('explorer')
  if (!manager) {
    return
  }

  const OPEN_HANDLER = 'open-explorer-window'
  const CLOSE_HANDLER = 'close-explorer-window'

  ipcMain.handle(OPEN_HANDLER, (_event, data) => {
    const deviceId = data?.id
    if (!deviceId) {
      return false
    }

    let explorerWindow = manager.get(deviceId)

    if (!isWindowDestroyed(explorerWindow)) {
      explorerWindow.show()
      explorerWindow.focus()
      return false
    }

    explorerWindow = manager.open({
      payload: data,
      instanceId: deviceId,
      show: true,
    })

    if (!explorerWindow) {
      return false
    }

    installWindowEvents(explorerWindow)

    return true
  })

  ipcMain.handle(CLOSE_HANDLER, (_event, data) => {
    const deviceId = data?.id
    if (!deviceId) {
      return false
    }

    const explorerWindow = manager.get(deviceId)

    if (isWindowDestroyed(explorerWindow)) {
      return false
    }

    explorerWindow.close()
    return true
  })

  return () => {
    ipcMain.removeHandler(OPEN_HANDLER)
    ipcMain.removeHandler(CLOSE_HANDLER)
  }
}
