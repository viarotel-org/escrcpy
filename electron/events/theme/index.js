import { ipcMain, nativeTheme } from 'electron'

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
    mainWindow.webContents.send('app-theme-change', {
      isDark: appTheme.isDark(),
      value: appTheme.value(),
    })
  })
}
