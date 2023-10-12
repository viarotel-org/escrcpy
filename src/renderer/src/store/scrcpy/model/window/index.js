export default () => {
  return [
    {
      label: '无边框模式',
      field: '--window-borderless',
      type: 'switch',
      value: false,
      placeholder: '开启无边框模式',
    },
    {
      label: '全屏模式',
      field: '--fullscreen',
      type: 'switch',
      value: false,
      placeholder: '开启全屏模式',
    },
  ]
}
