export default () => {
  return [
    {
      label: '录制视频格式',
      type: 'select',
      field: '--record-format',
      value: 'mp4',
      placeholder: '默认值为 mp4',
      options: [
        {
          label: 'mp4',
          value: 'mp4',
        },
        {
          label: 'mkv',
          value: 'mkv',
        },
      ],
    },
  ]
}
