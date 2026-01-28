export function install(copilotWindow) {
  copilotWindow.on('close', () => {
    copilotWindow.webContents.send('copilot-window-closing')
  })

  copilotWindow.on('focus', () => {})
  copilotWindow.on('blur', () => {})
}

export default {
  install,
}
