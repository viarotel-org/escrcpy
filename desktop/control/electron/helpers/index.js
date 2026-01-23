import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { TemplateBrowserWindow } from '$electron/helpers/window/index.js'

export function initControlWindow(mainWindow) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))

  const controlWindow = new TemplateBrowserWindow({
    __dirname,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    width: 700,
    minWidth: 700,
    height: 28,
    maxHeight: 28,
    alwaysOnTop: true,
    skipTaskbar: true,
  })

  controlWindow.loadPage('control')

  return controlWindow
}
