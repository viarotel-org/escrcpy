import appStore from '$electron/helpers/store.js'
import { app } from 'electron'

export default () => {
  appStore.onDidChange('common.autoLaunch', (flag) => {
    app.setLoginItemSettings({
      openAtLogin: flag,
    })
  })
}
