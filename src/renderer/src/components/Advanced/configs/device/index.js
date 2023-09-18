export default () => {
  return [
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
