import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { browserWindowWidth } from '$electron/configs/index.js'
import { createBrowserWindow } from '$electron/helpers/window/index.js'

export function initCopilotWindow(data) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))

  const copilotWindow = createBrowserWindow({
    preloadDir: __dirname,
    width: browserWindowWidth,
    minWidth: browserWindowWidth,
    height: browserWindowWidth * 0.7,
    minHeight: browserWindowWidth * 0.7,
  })

  copilotWindow.loadPage('copilot', data)

  return copilotWindow
}
