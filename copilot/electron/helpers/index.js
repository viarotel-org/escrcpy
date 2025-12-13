import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BrowserWindow } from 'electron'
import { browserWindowHeight, browserWindowWidth, getLogoPath } from '$electron/configs/index.js'
import { loadPage } from '$electron/helpers/index.js'

export function initCopilotWindow(mainWindow, data) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))

  const copilotWindow = new BrowserWindow({
    icon: getLogoPath(),
    width: browserWindowWidth,
    minWidth: 600,
    height: browserWindowHeight + 100,
    minHeight: 500,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: true,
      sandbox: false,
      spellcheck: false,
    },
  })

  copilotWindow.customId = 'copilot'

  loadPage(copilotWindow, 'copilot/', data)

  return copilotWindow
}
