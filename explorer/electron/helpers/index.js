import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BrowserWindow } from 'electron'
import { browserWindowHeight, browserWindowWidth, getLogoPath } from '$electron/configs/index.js'
import { sleep } from '$renderer/utils/index.js'
import { loadPage } from '$electron/helpers/index.js'

export function initExplorerWindow(mainWindow) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))

  const explorerWindow = new BrowserWindow({
    icon: getLogoPath(),
    width: browserWindowWidth,
    minWidth: browserWindowWidth,
    height: browserWindowHeight,
    minHeight: browserWindowHeight,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: true,
      sandbox: false,
      spellcheck: false,
    },
  })

  explorerWindow.customId = 'explorer'

  loadPage(explorerWindow, 'explorer/')

  return explorerWindow
}

export async function openExplorerWindow(win, data, args = {}) {
  if (args.sleep) {
    await sleep(args.sleep)
  }

  win.webContents.send('device-change', data)
  win.show()
}
