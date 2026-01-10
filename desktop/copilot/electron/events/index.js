function install(copilotWindow) {
  // Notify renderer to perform cleanup
  copilotWindow.on('close', () => {
    copilotWindow.webContents.send('copilot-window-closing')
  })

  // Handle when window gains focus
  copilotWindow.on('focus', () => {
  })

  // Handle when window loses focus
  copilotWindow.on('blur', () => {
  })
}

export {
  install,
}
