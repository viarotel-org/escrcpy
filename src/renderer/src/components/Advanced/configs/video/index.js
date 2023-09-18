export default () => {
  return [
    {
      label: '分辨率',
      type: 'input.number',
      field: '--max-size',
      value: '',
      placeholder: '默认值为设备分辨率，如 1920',
    },
    {
      label: '比特率',
      type: 'input',
      field: '--video-bit-rate',
      value: '',
      placeholder: '默认值为 4M，等同于 4000000',
    },
    {
      label: '刷新率',
      type: 'input.number',
      field: '--max-fps',
      value: '',
      placeholder: '默认值为 60',
    },
    {
      label: '屏幕旋转',
      type: 'select',
      field: '--rotation=0',
      value: '',
      placeholder: '默认值为设备屏幕旋转角度',
      options: [
        { label: '0°', value: '0' },
        { label: '-90°', value: '1' },
        { label: '180°', value: '2' },
        { label: '90°', value: '3' },
      ],
    },
    {
      label: '解码器',
      type: 'select',
      field: '--video-codec',
      value: '',
      placeholder: '解码器默认值为 h264',
      options: [
        {
          label: 'h264',
          value: 'h264',
        },
        {
          label: 'h265',
          value: 'h265',
        },
        {
          label: 'av1',
          value: 'av1',
        },
      ],
    },
    {
      label: '编码器',
      type: 'select',
      field: '--video-encoder',
      value: '',
      placeholder: '编码器默认值为 h264',
      // "[server] INFO: List of video encoders:"
      // "--video-codec=h264 --video-encoder='OMX.qcom.video.encoder.avc'"
      // "--video-codec=h264 --video-encoder='c2.android.avc.encoder'"
      // "--video-codec=h264 --video-encoder='OMX.google.h264.encoder'"
      // "--video-codec=h265 --video-encoder='OMX.qcom.video.encoder.hevc'"
      // "--video-codec=h265 --video-encoder='c2.android.hevc.encoder'"
      options: [
        {
          label: 'OMX.qcom.video.encoder.avc',
          value: 'OMX.qcom.video.encoder.avc',
        },
        {
          label: 'c2.android.avc.encoder',
          value: 'c2.android.avc.encoder',
        },
        {
          label: 'OMX.google.h264.encoder',
          value: 'OMX.google.h264.encoder',
        },
        {
          label: 'OMX.qcom.video.encoder.hevc',
          value: 'OMX.qcom.video.encoder.hevc',
        },
        {
          label: 'c2.android.hevc.encoder',
          value: 'c2.android.hevc.encoder',
        },
      ],
    },
  ]
}
