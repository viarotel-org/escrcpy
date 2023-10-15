export default () => {
  return [
    {
      label: '无边框模式',
      field: '--window-borderless',
      type: 'switch',
      value: false,
      placeholder: '开启后控制窗口将变为无边框模式',
    },
    {
      label: '全屏模式',
      field: '--fullscreen',
      type: 'switch',
      value: false,
      placeholder: '开启后控制窗口将全屏显示模式',
    },
    {
      label: '始终位于顶部',
      field: '--always-on-top',
      type: 'switch',
      value: false,
      placeholder: '开启后控制窗口将始终位于顶部',
    },
    {
      label: '禁用屏幕保护程序',
      field: '--disable-screensaver',
      type: 'switch',
      value: false,
      placeholder: '开启后将禁用计算机屏幕保护程序',
    },
  ]
}
