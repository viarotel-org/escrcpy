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
      label: '视频解码器',
      type: 'select',
      field: '--video-codec',
      value: '',
      placeholder: '默认值为 h264',
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
      label: '视频编码器',
      type: 'select',
      field: '--video-encoder',
      value: '',
      placeholder: '默认值为设备默认编码器',
      // "[server] INFO: List of video encoders:"
      // "--video-codec=h264 --video-encoder='OMX.qcom.video.encoder.avc'"
      // "--video-codec=h264 --video-encoder='c2.android.avc.encoder'"
      // "--video-codec=h264 --video-encoder='OMX.google.h264.encoder'"
      // "--video-codec=h265 --video-encoder='OMX.qcom.video.encoder.hevc'"
      // "--video-codec=h265 --video-encoder='c2.android.hevc.encoder'"
      options: [
        {
          label: 'Qualcomm AVC(H.264) 视频编码器',
          value: 'OMX.qcom.video.encoder.avc',
        },
        {
          label: 'Android AVC(H.264) 视频编码器',
          value: 'c2.android.avc.encoder',
        },
        {
          label: 'Google H.264(AVC) 视频编码器',
          value: 'OMX.google.h264.encoder',
        },
        {
          label: 'Qualcomm HEVC(H.265) 视频编码器',
          value: 'OMX.qcom.video.encoder.hevc',
        },
        {
          label: 'Android HEVC(H.265) 视频编码器',
          value: 'c2.android.hevc.encoder',
        },
      ],
    },
    {
      label: '屏幕旋转',
      type: 'select',
      field: '--rotation',
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
      label: '屏幕裁剪',
      type: 'input',
      field: '--crop',
      value: '',
      placeholder: '默认不裁剪，格式为 1224:1440:0:0',
    },
    {
      label: '多显示器',
      type: 'select',
      field: '--display',
      value: '',
      placeholder: '默认值为 0（主屏幕）',
      options: [
        { label: '0', value: '0' },
        { label: '1', value: '1' },
        { label: '2', value: '2' },
      ],
    },
    {
      label: '视频缓冲',
      type: 'input.number',
      field: '--display-buffer',
      value: '',
      placeholder: '单位为 ms，默认值为 0ms',
    },
    {
      label: '音频缓冲',
      type: 'input.number',
      field: '--audio-buffer',
      value: '',
      placeholder: '单位为 ms，默认值为 0ms',
    },
    {
      label: '接收器(v4l2)缓冲',
      type: 'input.number',
      field: '--v4l2-buffer',
      value: '',
      placeholder: '单位为 ms，默认值为 0ms',
    },
    {
      label: '禁用视频',
      type: 'switch',
      field: '--no-video',
      value: false,
      placeholder: '开启后将禁用视频',
    },
  ]
}
