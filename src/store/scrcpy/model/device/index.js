export default () => {
  return [
    {
      label: '展示触摸点',
      type: 'switch',
      field: '--show-touches',
      value: false,
      placeholder: '开启后将打开开发者选项中的显示点按触摸反馈',
      tips: '仅在物理设备上展示',
    },
    {
      label: '保持清醒',
      type: 'switch',
      field: '--stay-awake',
      value: false,
      placeholder: '开启以防止设备进入睡眠状态',
      tips: '仅有线方式连接时有效',
    },
    {
      label: '控制时关闭屏幕',
      type: 'switch',
      field: '--turn-screen-off',
      value: false,
      placeholder: '开启后控制设备时将自动关闭设备屏幕',
    },
    {
      label: '控制结束关闭屏幕',
      type: 'switch',
      field: '--power-off-on-close',
      value: false,
      placeholder: '开启后停止控制设备将自动关闭设备屏幕',
    },
    {
      label: '控制时停止充电',
      type: 'switch',
      field: '--no-power-on',
      value: false,
      placeholder: '开启后控制设备时将停止充电',
      tips: '某些机型上似乎不起作用',
    },
  ]
}
