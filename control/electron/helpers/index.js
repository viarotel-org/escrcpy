import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BrowserWindow } from 'electron'
import { getLogoPath } from '$electron/configs/index.js'
import { sleep } from '$renderer/utils/index.js'
import { loadPage } from '$electron/helpers/index.js'

export function initControlWindow(mainWindow) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))

  const controlWindow = new BrowserWindow({
    transparent: true,
    backgroundColor: '#00000000',
    icon: getLogoPath(),
    width: 700,
    minWidth: 700,
    height: 28,
    maxHeight: 28,
    frame: false,
    show: false,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: true,
      sandbox: false,
      spellcheck: false,
    },
  })

  controlWindow.customId = 'control'

  loadPage(controlWindow, 'control/')

  return controlWindow
}

export async function openControlWindow(win, data, args = {}) {
  if (args.sleep) {
    await sleep(args.sleep)
  }

  win.show()
  win.webContents.send('device-change', data)
}
