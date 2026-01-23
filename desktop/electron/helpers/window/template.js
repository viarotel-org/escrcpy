import path from 'node:path'
import { BrowserWindow, shell } from 'electron'
import { browserWindowHeight, browserWindowWidth, getLogoPath } from '$electron/configs/index.js'
import { getAppBackgroundColor, loadPage } from '$electron/helpers/index.js'
import { debounce } from 'lodash-es'
import electronStore from '$electron/helpers/store/index.js'

export class TemplateBrowserWindow extends BrowserWindow {
  constructor(options = {}) {
    const { __dirname } = options

    const sizeOptions = electronStore.get('common.bounds') || {}

    const titleBarOptions = (() => {
      const platform = import.meta.env.VITE_SIMULATION_PLATFORM ?? process.platform

      const value = {}

      if (['win32', 'linux'].includes(platform)) {
        value.frame = false
      }

      if (['darwin'].includes(platform)) {
        value.titleBarStyle = 'hiddenInset'
      }

      return value
    })()

    const presetOptions = {
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
      ...sizeOptions,
      ...titleBarOptions,
    }

    super({ ...presetOptions, ...options })

    this.onResize = debounce(this.onResize.bind(this), 500)

    this.createListeners()

    this.setWindowOpenHandler()
  }

  setWindowOpenHandler() {
    this.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })
  }

  createListeners() {
    this.on('resize', this.onResize)
  }

  onResize() {
    if (this.isMaximized()) {
      return false
    }

    const bounds = this.getBounds()

    electronStore.set('common.bounds', {
      width: bounds.width,
      height: bounds.height,
    })
  }

  loadPage(prefix, query) {
    this.customId = prefix || 'main'

    loadPage(this, `${prefix}/`, query)
  }
}
