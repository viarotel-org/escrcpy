import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createBrowserWindow } from '$electron/helpers/window/index.js'

export function initExplorerWindow(data) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))

  const explorerWindow = createBrowserWindow({
    preloadDir: __dirname,
    frame: true,
    titleBarStyle: 'default',
  })

  explorerWindow.loadPage('explorer', data)

  return explorerWindow
}
