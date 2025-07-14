import { ipcMain, nativeTheme } from 'electron'
import appStore from '$electron/helpers/store.js'

export default (mainWindow) => {
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

  nativeTheme.on('updated', () => {
    appStore.set('common.theme', appTheme.value())
    appStore.set('common.isDark', appTheme.isDark())
  })
}
