export default () => {
  return [
    {
      label: '展示触摸点',
      type: 'switch',
      field: '--show-touches',
      value: false,
      placeholder: '开启后将打开开发者选项中的显示点按触摸反馈(仅在物理设备上展示)',
    },
    {
      label: '保持清醒',
      type: 'switch',
      field: '--stay-awake',
      value: false,
      placeholder: '开启以防止设备进入睡眠状态(仅有线方式连接时有效)',
    },
    {
      label: '关闭屏幕',
      type: 'switch',
      field: '--turn-screen-off',
      value: false,
      placeholder: '开启后连接镜像时将自动关闭设备屏幕',
    },
  ]
}
