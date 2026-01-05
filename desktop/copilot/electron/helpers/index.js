import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BrowserWindow, shell } from 'electron'
import { browserWindowWidth, getLogoPath } from '$electron/configs/index.js'
import { autoUpdateTitleBarOverlay, loadPage } from '$electron/helpers/index.js'

export function initCopilotWindow(mainWindow, data) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))

  const copilotWindow = new BrowserWindow({
    icon: getLogoPath(),
    width: browserWindowWidth,
    minWidth: browserWindowWidth,
    height: browserWindowWidth * 0.7,
    minHeight: browserWindowWidth * 0.7,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    ...(['win32'].includes(process.platform) ? { titleBarOverlay: true } : {}),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: true,
      sandbox: false,
      spellcheck: false,
    },
  })

  copilotWindow.customId = 'copilot'

  autoUpdateTitleBarOverlay(copilotWindow)

  copilotWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  loadPage(copilotWindow, 'copilot/', data)

  return copilotWindow
}
