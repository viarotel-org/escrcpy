export default () => {
  const $path = window.nodePath

  const { adbPath, scrcpyPath } = window?.electron?.configs || {}

  return [
    {
      label: '文件存储路径',
      type: 'input.path',
      field: 'savePath',
      value: $path.resolve('../'),
      placeholder: '默认值为执行应用的同级目录',
      tips: '截图和录制的音视频都存在这里',
      properties: ['openDirectory'],
    },
    {
      label: 'Adb 路径',
      field: 'adbPath',
      type: 'input.path',
      value: adbPath,
      tips: '用于连接设备的 adb.exe 的地址，注意：改变此选项时需要重启服务',
      placeholder: '请选择 Adb.exe',
      properties: ['openFile'],
      filters: [{ name: '请选择 Adb.exe', extensions: ['exe'] }],
    },
    {
      label: 'Scrcpy 路径',
      field: 'scrcpyPath',
      type: 'input.path',
      value: scrcpyPath,
      tips: '用于控制设备的 Scrcpy.exe 的地址',
      placeholder: '请选择 Scrcpy.exe',
      properties: ['openFile'],
      filters: [{ name: '请选择 Scrcpy.exe', extensions: ['exe'] }],
    },
  ]
}
