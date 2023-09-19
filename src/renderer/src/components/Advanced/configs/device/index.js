export default () => {
  return [
    {
      label: '虚拟控制栏',
      type: 'switch',
      field: '--show-touches',
      value: false,
      placeholder: '开启后将打开虚拟控制栏，在某些机型上可能不会生效 比如较老的具有实体按键的设备',
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
