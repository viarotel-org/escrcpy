export default (app) => {
  const manager = app.getWindowManager('copilot')

  if (!manager) {
    return
  }

  // Event listeners will be attached when each copilot window is created
  // in the service.js file via installWindowEvents function
}

export function installWindowEvents(copilotWindow) {
  const onClose = () => {
    copilotWindow.webContents.send('copilot-window-closing')
  }

  const onFocus = () => {
    // Handle focus event if needed
  }

  const onBlur = () => {
    // Handle blur event if needed
  }

  copilotWindow.on('close', onClose)
  copilotWindow.on('focus', onFocus)
  copilotWindow.on('blur', onBlur)

  return () => {
    copilotWindow.off('close', onClose)
    copilotWindow.off('focus', onFocus)
    copilotWindow.off('blur', onBlur)
  }
}
