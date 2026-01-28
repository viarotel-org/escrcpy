import { electronAPI } from '@electron-toolkit/preload'
import { ipcxRenderer } from '@escrcpy/electron-ipcx/renderer'
import * as electronConfigs from '$electron/configs/index.js'

const configs = {
  ...electronConfigs,
}

const window = {
  open(id, options) {
    return ipcxRenderer.invoke('window-open', { id, options })
  },
  close(id, instanceId) {
    return ipcxRenderer.invoke('window-close-by-id', { id, instanceId })
  },
  destroy(id, instanceId) {
    return ipcxRenderer.invoke('window-destroy-by-id', { id, instanceId })
  },
  focus(id, instanceId) {
    return ipcxRenderer.invoke('window-focus-by-id', { id, instanceId })
  },
}

export default {
  ...electronAPI,
  configs,
  ipcxRenderer,
  window,
}
