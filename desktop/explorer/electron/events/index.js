function install(explorerWindow) {
  // Add file explorer window event listeners here
  // e.g.: window close, focus changes, etc.

  explorerWindow.on('close', () => {
    // Cleanup work when window closes
  })

  explorerWindow.on('focus', () => {
    // 窗口获得焦点时的处理
  })

  explorerWindow.on('blur', () => {
    // 窗口失去焦点时的处理
  })
}

export {
  install,
}
