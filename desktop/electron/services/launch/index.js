import electronStore from '$electron/helpers/store/index.js'
import { app } from 'electron'
import { platform } from '@electron-toolkit/utils'

export default () => {
  electronStore.onDidChange('common.autoLaunch', async (flag) => {
    if (platform.isLinux) {
      const AutoLaunch = (await import('auto-launch')).default
      const autoLaunch = new AutoLaunch({
        name: 'Escrcpy',
      })
      autoLaunch[flag ? 'enable' : 'disable']()
      return
    }

    app.setLoginItemSettings({
      openAtLogin: flag,
      openAsHidden: true,
      args: ['--minimized'],
    })
  })
}
