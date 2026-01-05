import { electronAPI } from '@electron-toolkit/preload'
import { ipcxRenderer } from '@escrcpy/electron-ipcx/renderer'
import * as electronConfigs from '$electron/configs/index.js'

const configs = {
  ...electronConfigs,
}

export default {
  ...electronAPI,
  configs,
  ipcxRenderer,
}
