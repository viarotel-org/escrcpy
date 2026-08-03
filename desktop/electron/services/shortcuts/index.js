import { BrowserWindow, globalShortcut, ipcMain } from 'electron'

const registeredShortcuts = new Map()
let isRecordingMode = false

function sendShortcutTriggered(id) {
  if (isRecordingMode) {
    return
  }

  BrowserWindow.getAllWindows().forEach((window) => {
    if (window.isDestroyed() || window.webContents.isDestroyed()) {
      return
    }

    window.webContents.send('shortcut-triggered', id)
  })
}

function unregisterById(id) {
  const accelerator = registeredShortcuts.get(id)

  if (!accelerator) {
    return { id, unregistered: false }
  }

  globalShortcut.unregister(accelerator)
  registeredShortcuts.delete(id)
  return { id, accelerator, unregistered: true }
}

function unregisterAll() {
  const ids = Array.from(registeredShortcuts.keys())
  ids.forEach(id => unregisterById(id))
  return { unregistered: ids.length }
}

function registerShortcut(payload = {}) {
  const { id, accelerator } = payload

  if (!id || !accelerator) {
    return { success: false, error: 'Shortcut id and accelerator are required' }
  }

  unregisterById(id)

  const registered = globalShortcut.register(accelerator, () => {
    sendShortcutTriggered(id)
  })

  if (!registered) {
    return { success: false, error: `Failed to register shortcut: ${accelerator}` }
  }

  registeredShortcuts.set(id, accelerator)
  return { success: true, data: { id, accelerator } }
}

export default {
  name: 'service:shortcuts',
  apply() {
    ipcMain.handle('shortcut-register', (_, payload) => {
      return registerShortcut(payload)
    })

    ipcMain.handle('shortcut-unregister', (_, id) => {
      return unregisterById(id)
    })

    ipcMain.handle('shortcut-unregister-all', () => {
      return unregisterAll()
    })

    ipcMain.handle('shortcut-is-registered', (_, accelerator) => {
      return globalShortcut.isRegistered(accelerator)
    })

    ipcMain.handle('shortcut-set-recording-mode', (_, enabled) => {
      isRecordingMode = Boolean(enabled)

      if (isRecordingMode) {
        for (const accelerator of registeredShortcuts.values()) {
          globalShortcut.unregister(accelerator)
        }

        return { success: true }
      }

      for (const [id, accelerator] of registeredShortcuts) {
        const isRegistered = globalShortcut.isRegistered(accelerator)

        if (!isRegistered) {
          globalShortcut.register(accelerator, () => {
            sendShortcutTriggered(id)
          })
        }
      }

      return { success: true }
    })

    return () => {
      unregisterAll()
      ipcMain.removeHandler('shortcut-register')
      ipcMain.removeHandler('shortcut-unregister')
      ipcMain.removeHandler('shortcut-unregister-all')
      ipcMain.removeHandler('shortcut-is-registered')
      ipcMain.removeHandler('shortcut-set-recording-mode')
    }
  },
}
