import { ipcRenderer } from 'electron'

function open(id, options) {
  return ipcRenderer.invoke('window-open', { id, options })
}

function close(id, instanceId) {
  return ipcRenderer.invoke('window-close-by-id', { id, instanceId })
}

function destroy(id, instanceId) {
  return ipcRenderer.invoke('window-destroy-by-id', { id, instanceId })
}

function focus(id, instanceId) {
  return ipcRenderer.invoke('window-focus-by-id', { id, instanceId })
}

export default {
  open,
  close,
  destroy,
  focus,
}
