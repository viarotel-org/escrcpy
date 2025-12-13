function install(copilotWindow) {
  // 窗口关闭时的清理工作
  copilotWindow.on('close', () => {
    // 停止正在执行的任务
    // 通知渲染进程进行清理
    copilotWindow.webContents.send('copilot-window-closing')
  })

  copilotWindow.on('focus', () => {
    // 窗口获得焦点时的处理
  })

  copilotWindow.on('blur', () => {
    // 窗口失去焦点时的处理
  })
}

export {
  install,
}
