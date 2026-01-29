export default (app) => {
  const manager = app.getWindowManager('explorer')

  if (!manager) {
    return
  }

  // Event listeners will be attached when each explorer window is created
  // in the service.js file via installWindowEvents function
}

export function installWindowEvents(explorerWindow) {
  const onFocus = () => {
    // Handle focus event if needed
  }

  const onBlur = () => {
    // Handle blur event if needed
  }

  const onClose = () => {
    // Handle close event if needed
  }

  explorerWindow.on('focus', onFocus)
  explorerWindow.on('blur', onBlur)
  explorerWindow.on('close', onClose)

  return () => {
    explorerWindow.off('focus', onFocus)
    explorerWindow.off('blur', onBlur)
    explorerWindow.off('close', onClose)
  }
}
