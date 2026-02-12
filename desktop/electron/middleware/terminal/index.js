import { ipcxRenderer } from '@escrcpy/electron-ipcx/renderer'

function create(config) {
  const { promise, dispose } = ipcxRenderer.invokeRetained('terminal:create-session', config)

  return promise.then(result => ({ ...result, dispose }))
}

function write(sessionId, data) {
  return ipcxRenderer.invoke('terminal:write-session', { sessionId, data })
}

function resize(sessionId, cols, rows) {
  return ipcxRenderer.invoke('terminal:resize-session', { sessionId, cols, rows })
}

function destroy(sessionId) {
  return ipcxRenderer.invoke('terminal:destroy-session', { sessionId })
}

export default {
  create,
  write,
  resize,
  destroy,
}
