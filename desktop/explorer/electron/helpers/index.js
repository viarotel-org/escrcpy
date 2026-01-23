import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { TemplateBrowserWindow } from '$electron/helpers/window/index.js'

export function initExplorerWindow(mainWindow, data) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))

  const explorerWindow = new TemplateBrowserWindow({
    __dirname,
    frame: true,
    titleBarStyle: 'default',
  })

  explorerWindow.loadPage('explorer', data)

  return explorerWindow
}
