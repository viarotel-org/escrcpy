import { BrowserWindow, globalShortcut, ipcMain, screen } from 'electron'
import {
  forwardNativePointer,
  getEmbeddedVideoBounds,
  getNativeParentWindowHandle,
  setEmbeddedVideoSize,
  setKeyboardMappingEditorOpen,
  setKeyboardMappingOverlayOpen,
  setNativeKeyBindings,
} from './native-container.js'

function closeWindow(win) {
  return new Promise((resolve) => {
    let settled = false
    let timeout

    function finish() {
      if (settled) {
        return
      }

      settled = true
      clearTimeout(timeout)
      resolve()
    }

    timeout = setTimeout(() => {
      if (!win.isDestroyed()) {
        win.destroy()
      }

      finish()
    }, 1500)

    win.once('closed', finish)
    win.close()
  })
}

export default {
  name: 'module:control:service',
  apply(mainApp) {
    const registeredAccelerators = new Set()
    const observedSenders = new WeakSet()
    const observedWindows = new WeakSet()
    const embeddedContainerIds = new WeakMap()
    const overlayParents = new WeakMap()
    const parentOverlays = new WeakMap()
    const editorOpenParents = new WeakSet()
    let containerSequence = 0
    let popoverCloseTimer

    function clearMappings() {
      for (const accelerator of registeredAccelerators) {
        globalShortcut.unregister(accelerator)
      }

      registeredAccelerators.clear()
    }

    ipcMain.handle('keyboard-mapping:set-active', async (event, payload = {}) => {
      clearMappings()

      const ownerWindow = BrowserWindow.fromWebContents(event.sender)

      if (ownerWindow && !observedWindows.has(ownerWindow)) {
        observedWindows.add(ownerWindow)
        ownerWindow.on('blur', clearMappings)
        ownerWindow.on('hide', clearMappings)
        ownerWindow.on('minimize', clearMappings)
        ownerWindow.on('focus', () => {
          if (!event.sender.isDestroyed())
            event.sender.send('keyboard-mapping:request-sync')
        })
      }

      if (!observedSenders.has(event.sender)) {
        observedSenders.add(event.sender)
        event.sender.once('destroyed', clearMappings)
      }

      const failed = []
      const bindings = ownerWindow?.isFocused() && !editorOpenParents.has(ownerWindow)
        && Array.isArray(payload.bindings)
        ? payload.bindings
        : []

      for (const binding of bindings) {
        const accelerator = String(binding?.accelerator || '').trim()

        if (!accelerator || registeredAccelerators.has(accelerator)) {
          continue
        }

        const success = globalShortcut.register(accelerator, () => {
          if (!event.sender.isDestroyed()
            && ownerWindow?.isFocused()
            && !editorOpenParents.has(ownerWindow)) {
            event.sender.send('keyboard-mapping:trigger', binding.id)
          }
        })

        if (success) {
          registeredAccelerators.add(accelerator)
        }
        else {
          failed.push(accelerator)
        }
      }

      return {
        success: failed.length === 0,
        registered: [...registeredAccelerators],
        failed,
      }
    })

    ipcMain.handle('keyboard-mapping:clear', async () => {
      clearMappings()
      return { success: true }
    })

    ipcMain.handle('keyboard-mapping:set-native-bindings', async (event, bindings = []) => {
      const ownerWindow = BrowserWindow.fromWebContents(event.sender)
      if (!ownerWindow || ownerWindow.isDestroyed())
        return false
      const accelerators = []
      for (const binding of Array.isArray(bindings) ? bindings : []) {
        const accelerator = String(binding?.accelerator || '').trim()
        if (accelerator && !accelerators.includes(accelerator))
          accelerators.push(accelerator)
      }
      return setNativeKeyBindings(ownerWindow, accelerators)
    })

    ipcMain.handle('control:set-editor-open', async (event, payload = {}) => {
      const win = BrowserWindow.fromWebContents(event.sender)

      if (!win || win.isDestroyed()) {
        return false
      }

      const overlayParent = overlayParents.get(win)
      if (overlayParent && !overlayParent.isDestroyed()) {
        const open = Boolean(payload.open)
        if (open)
          editorOpenParents.add(overlayParent)
        else
          editorOpenParents.delete(overlayParent)
        overlayParent.webContents.send('keyboard-mapping:editor-state', open)
        win.setFocusable(open)
        if (open) {
          // Whole-window opacity is also a Windows fallback for transparent
          // composition, so the video remains visible below the edit mask.
          win.setOpacity(0.88)
          win.show()
          win.focus()
        }
        else {
          overlayParent.webContents.send('keyboard-mapping:config-updated', {
            deviceId: payload.deviceId,
            config: payload.config,
          })
          // The transparent overlay stays fully composited so it can draw
          // keyboard hints while continuing to forward pointer input.
          win.setOpacity(1)
          win.showInactive()
          overlayParent.focus()
        }
        return true
      }

      if (setKeyboardMappingEditorOpen(win, Boolean(payload.open))) {
        return true
      }

      const collapsedWidth = 48
      const expandedWidth = 408
      const nextWidth = payload.open ? expandedWidth : collapsedWidth
      const bounds = win.getBounds()
      const right = bounds.x + bounds.width

      win.setBounds({
        ...bounds,
        x: right - nextWidth,
        width: nextWidth,
      })

      return true
    })

    ipcMain.handle('control:forward-pointer', async (event, payload = {}) => {
      const senderWindow = BrowserWindow.fromWebContents(event.sender)
      const targetWindow = overlayParents.get(senderWindow) || senderWindow
      return Boolean(targetWindow && !targetWindow.isDestroyed()
        && !editorOpenParents.has(targetWindow)
        && forwardNativePointer(targetWindow, payload))
    })

    ipcMain.handle('control:set-mapping-overlay-open', async (event, payload = {}) => {
      const win = BrowserWindow.fromWebContents(event.sender)
      return Boolean(win && !win.isDestroyed()
        && setKeyboardMappingOverlayOpen(win, Boolean(payload.open)))
    })

    ipcMain.handle('control:show-mapping-popover', async (event, payload = {}) => {
      const parent = BrowserWindow.fromWebContents(event.sender)
      const manager = mainApp.getWindowManager('mapping-popover')
      if (!parent || parent.isDestroyed() || !manager)
        return false
      if (editorOpenParents.has(parent))
        return false
      clearTimeout(popoverCloseTimer)
      const bounds = parent.getBounds()
      const height = Math.max(86, Math.min(260, 50 + (payload.profileCount || 1) * 42))
      const point = screen.getCursorScreenPoint()
      const existing = manager.get()
      const win = existing && !existing.isDestroyed()
        ? existing
        : await manager.create({
            page: 'pages/control',
            payload: {
              mappingPopover: true,
              device: payload.device,
              config: payload.config,
            },
            show: false,
          })
      if (!win || win.isDestroyed())
        return false
      win.setParentWindow(parent)
      win.setBounds({ x: bounds.x + bounds.width - 48 - 300, y: Math.max(bounds.y + 44, point.y - 24), width: 300, height })
      win.webContents.send('keyboard-mapping:reload-popover', {
        deviceId: payload.device?.id,
        config: payload.config,
      })
      win.showInactive()
      win.moveTop()
      return true
    })

    ipcMain.handle('control:hide-mapping-popover', async (_event, payload = {}) => {
      const manager = mainApp.getWindowManager('mapping-popover')
      clearTimeout(popoverCloseTimer)
      popoverCloseTimer = setTimeout(() => {
        const popover = manager?.get()
        const parent = popover?.getParentWindow()
        popover?.hide()
        const inputOverlay = parent && parentOverlays.get(parent)
        if (inputOverlay
          && !inputOverlay.isDestroyed()
          && !editorOpenParents.has(parent)) {
          inputOverlay.setIgnoreMouseEvents(false)
          inputOverlay.setOpacity(1)
          inputOverlay.showInactive()
        }
      }, payload.immediate ? 0 : 220)
      return true
    })

    ipcMain.handle('control:keep-mapping-popover', async () => {
      clearTimeout(popoverCloseTimer)
      return true
    })

    ipcMain.handle('control:open-mapping-editor', async (event) => {
      const popup = BrowserWindow.fromWebContents(event.sender)
      const parent = popup?.getParentWindow()
      if (!parent || parent.isDestroyed())
        return false
      clearTimeout(popoverCloseTimer)
      const overlay = parentOverlays.get(parent)
      const editorTarget = overlay && !overlay.isDestroyed() ? overlay : parent
      if (overlay && !overlay.isDestroyed())
        overlay.setIgnoreMouseEvents(false)
      editorTarget.webContents.send('keyboard-mapping:open-editor')
      mainApp.getWindowManager('mapping-popover')?.get()?.hide()
      return true
    })

    ipcMain.handle('control:select-mapping-profile', async (event, payload = {}) => {
      const popup = BrowserWindow.fromWebContents(event.sender)
      const parent = popup?.getParentWindow()
      if (!parent || parent.isDestroyed())
        return false
      parent.webContents.send('keyboard-mapping:select-profile', payload.id)
      return true
    })

    ipcMain.handle('control:open-embedded', async (_event, payload = {}) => {
      if (process.platform !== 'win32' || !payload.targetWindowTitle) {
        return null
      }

      const manager = mainApp.getWindowManager('pages/control')

      if (!manager) {
        throw new Error('The mirror container window is not registered.')
      }

      const current = manager.get()

      if (current && !current.isDestroyed()) {
        await closeWindow(current)
      }

      const win = await manager.open({
        payload,
        show: false,
      })

      if (!win || win.isDestroyed()) {
        throw new Error('Unable to create the mirror container window.')
      }

      const containerId = `${Date.now()}-${++containerSequence}`
      embeddedContainerIds.set(win, containerId)

      const overlayManager = mainApp.getWindowManager('control-overlay')
      const overlay = await overlayManager?.create({
        page: 'pages/control',
        payload: {
          inputOverlay: true,
          device: payload.device,
        },
        show: false,
      })

      if (overlay && !overlay.isDestroyed()) {
        overlay.setParentWindow(win)
        overlayParents.set(overlay, win)
        parentOverlays.set(win, overlay)

        const syncOverlayBounds = () => {
          if (win.isDestroyed() || overlay.isDestroyed())
            return
          const bounds = getEmbeddedVideoBounds(win)
          if (bounds)
            overlay.setBounds(bounds)
        }

        win.on('move', syncOverlayBounds)
        win.on('resize', syncOverlayBounds)
        win.on('control-video-bounds-changed', syncOverlayBounds)
        win.on('show', () => {
          syncOverlayBounds()
          overlay.setOpacity(1)
          overlay.showInactive()
        })
        win.on('hide', () => overlay.hide())
        win.on('closed', () => {
          if (!overlay.isDestroyed())
            overlay.destroy()
        })
      }

      return {
        containerId,
        parentWindowHandle: getNativeParentWindowHandle(win),
      }
    })

    ipcMain.handle('control:close-embedded', async (_event, payload = {}) => {
      const win = mainApp.getWindowManager('pages/control')?.get()

      if (
        !win
        || win.isDestroyed()
        || embeddedContainerIds.get(win) !== payload.containerId
      ) {
        return false
      }

      win.close()
      return true
    })

    ipcMain.handle('control:set-video-size', async (_event, payload = {}) => {
      const win = mainApp.getWindowManager('pages/control')?.get()

      if (!win
        || win.isDestroyed()
        || embeddedContainerIds.get(win) !== payload.containerId) {
        return false
      }

      return setEmbeddedVideoSize(win, payload.width, payload.height)
    })

    return () => {
      clearMappings()
      ipcMain.removeHandler('keyboard-mapping:set-active')
      ipcMain.removeHandler('keyboard-mapping:clear')
      ipcMain.removeHandler('keyboard-mapping:set-native-bindings')
      ipcMain.removeHandler('control:set-editor-open')
      ipcMain.removeHandler('control:forward-pointer')
      ipcMain.removeHandler('control:set-mapping-overlay-open')
      ipcMain.removeHandler('control:show-mapping-popover')
      ipcMain.removeHandler('control:hide-mapping-popover')
      ipcMain.removeHandler('control:keep-mapping-popover')
      ipcMain.removeHandler('control:open-mapping-editor')
      ipcMain.removeHandler('control:select-mapping-profile')
      ipcMain.removeHandler('control:open-embedded')
      ipcMain.removeHandler('control:close-embedded')
      ipcMain.removeHandler('control:set-video-size')
    }
  },
}
