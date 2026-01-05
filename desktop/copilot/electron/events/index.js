function install(copilotWindow) {
  // 通知渲染进程进行清理
  copilotWindow.on('close', () => {
    copilotWindow.webContents.send('copilot-window-closing')
  })

  // 窗口获得焦点时的处理
  copilotWindow.on('focus', () => {
  })

  // 窗口失去焦点时的处理
  copilotWindow.on('blur', () => {
  })
}

export {
  install,
}
