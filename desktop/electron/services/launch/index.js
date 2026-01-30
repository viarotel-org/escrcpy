import electronStore from '$electron/helpers/store/index.js'
import { app as electronApp } from 'electron'
import { platform } from '@electron-toolkit/utils'

export default {
  name: 'service:launch',
  apply() {
    electronStore.onDidChange('common.autoLaunch', async (flag) => {
      if (platform.isLinux) {
        const AutoLaunch = (await import('auto-launch')).default
        const autoLaunch = new AutoLaunch({
          name: 'Escrcpy',
        })
        autoLaunch[flag ? 'enable' : 'disable']()
        return
      }

      electronApp.setLoginItemSettings({
        openAtLogin: flag,
        openAsHidden: true,
        args: ['--minimized'],
      })
    })
  },
}
