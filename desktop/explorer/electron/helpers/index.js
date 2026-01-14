import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BrowserWindow } from 'electron'
import { browserWindowHeight, browserWindowWidth, getLogoPath } from '$electron/configs/index.js'
import { getAppBackgroundColor, loadPage } from '$electron/helpers/index.js'

export function initExplorerWindow(mainWindow, data) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))

  const explorerWindow = new BrowserWindow({
    show: false,
    icon: getLogoPath(),
    width: browserWindowWidth,
    minWidth: browserWindowWidth,
    height: browserWindowHeight,
    minHeight: browserWindowHeight,
    autoHideMenuBar: true,
    backgroundColor: getAppBackgroundColor(),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: true,
      sandbox: false,
      spellcheck: false,
    },
  })

  explorerWindow.customId = 'explorer'

  loadPage(explorerWindow, 'explorer/', data)

  return explorerWindow
}
