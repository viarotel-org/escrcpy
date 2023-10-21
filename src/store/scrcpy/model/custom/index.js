export default () => {
  const { adbPath, scrcpyPath, desktopPath } = window?.electron?.configs || {}

  return [
    {
      label: '文件存储路径',
      type: 'input.path',
      field: 'savePath',
      value: desktopPath,
      placeholder: '默认值为执行应用的同级目录',
      tips: '截图和录制的音视频都存在这里',
      properties: ['openDirectory'],
    },
    {
      label: 'adb 路径',
      field: 'adbPath',
      type: 'input.path',
      value: adbPath,
      tips: '用于连接设备的 adb 的地址，注意：该选项不受针对于单个设备配置的影响',
      placeholder: '请选择 adb',
      properties: ['openFile'],
      filters: [{ name: '请选择 adb', extensions: ['*'] }],
    },
    {
      label: 'scrcpy 路径',
      field: 'scrcpyPath',
      type: 'input.path',
      value: scrcpyPath,
      tips: '用于控制设备的 scrcpy 的地址，注意：该选项不受针对于单个设备配置的影响',
      placeholder: '请选择 scrcpy',
      properties: ['openFile'],
      filters: [{ name: '请选择 scrcpy', extensions: ['*'] }],
    },
  ]
}
