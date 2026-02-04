import { ipcMain } from 'electron'
import { shellManager } from './helpers/index.js'
import { trySend } from '$electron/helpers/index.js'

export default {
  name: 'module:terminal:service',
  apply(mainApp) {
    ipcMain.handle('terminal:create-shell', async (event, deviceId) => {
      try {
        const { id } = await shellManager.createAdbShell(deviceId, {
          stdout(data) {
            trySend(event.sender, `terminal:shell-output-${id}`, data)
          },
          stderr(data) {
            trySend(event.sender, `terminal:shell-output-${id}`, data)
          },
          error(message, code) {
            trySend(event.sender, `terminal:shell-error-${id}`, { message, code })
          },
          exit(code, signal) {
            trySend(event.sender, `terminal:shell-exit-${id}`, { code, signal })
          },
        })

        return { success: true, shellId: id }
      }
      catch (error) {
        console.error('[Terminal Service] Failed to create shell:', error)
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle('terminal:write-shell', async (event, shellId, data) => {
      try {
        const shell = shellManager.get(shellId)
        if (!shell) {
          throw new Error(`Shell ${shellId} not found`)
        }
        shell.controller.send(data)
        return { success: true }
      }
      catch (error) {
        console.error('[Terminal Service] Failed to write shell:', error)
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle('terminal:destroy-shell', async (event, shellId) => {
      try {
        shellManager.destroy(shellId)
        return { success: true }
      }
      catch (error) {
        console.error('[Terminal Service] Failed to destroy shell:', error)
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle('terminal:destroy-device-shells', async (event, deviceId) => {
      try {
        shellManager.destroyByDevice(deviceId)
        return { success: true }
      }
      catch (error) {
        console.error('[Terminal Service] Failed to destroy device shells:', error)
        return { success: false, error: error.message }
      }
    })

    return () => {
      shellManager.destroyAll()
      ipcMain.removeHandler('terminal:create-shell')
      ipcMain.removeHandler('terminal:write-shell')
      ipcMain.removeHandler('terminal:destroy-shell')
      ipcMain.removeHandler('terminal:destroy-device-shells')
    }
  },
}
