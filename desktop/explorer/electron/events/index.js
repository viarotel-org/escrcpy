function install(explorerWindow) {
  // 可以在这里添加文件管理器窗口的事件监听
  // 例如：窗口关闭、焦点变化等

  explorerWindow.on('close', () => {
    // 窗口关闭时的清理工作
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
