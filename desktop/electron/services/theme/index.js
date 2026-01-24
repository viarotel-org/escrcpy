import { app, ipcMain, nativeTheme } from 'electron'
import electronStore from '$electron/helpers/store/index.js'

export default () => {
  const appTheme = {
    value() {
      return nativeTheme.themeSource
    },
    update(value) {
      nativeTheme.themeSource = value
    },
    isDark() {
      return nativeTheme.shouldUseDarkColors
    },
  }

  Object.entries(appTheme).forEach(([key, handler]) => {
    ipcMain.handle(`app-theme-${key}`, (_, value) => handler(value))
  })

  nativeTheme.on('updated', onUpdated)

  app.on('before-quit', () => {
    nativeTheme.off('updated', onUpdated)
  })

  function onUpdated() {
    electronStore.set('common.theme', appTheme.value())
    electronStore.set('common.isDark', appTheme.isDark())
  }
}
