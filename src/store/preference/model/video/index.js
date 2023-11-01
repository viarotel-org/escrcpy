export default {
  label: 'preferences.video.name',
  field: 'scrcpy',

  children: {
    maxSize: {
      label: 'preferences.video.resolution.name',
      field: '--max-size',
      type: 'Input.number',
      value: '',
      placeholder: 'preferences.video.resolution.placeholder',
    },
    videoBitRate: {
      label: 'preferences.video.bit.name',
      field: '--video-bit-rate',
      type: 'Input',
      value: '',
      placeholder: 'preferences.video.bit.placeholder',
    },
    maxFps: {
      label: 'preferences.video.refresh-rate.name',
      field: '--max-fps',
      type: 'Input.number',
      value: '',
      placeholder: 'preferences.video.refresh-rate.placeholder',
    },
    videoCodec: {
      label: 'preferences.video.decoder.name',
      field: '--video-codec',
      type: 'Select',
      value: '',
      placeholder: 'preferences.video.decoder.placeholder',
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
    videoEncoder: {
      label: 'preferences.video.encoder.name',
      field: '--video-encoder',
      type: 'Select',
      value: '',
      placeholder: 'preferences.video.encoder.placeholder',
      // "[server] INFO: List of video encoders:"
      // "--video-codec=h264 --video-encoder='OMX.qcom.video.encoder.avc'"
      // "--video-codec=h264 --video-encoder='c2.android.avc.encoder'"
      // "--video-codec=h264 --video-encoder='OMX.google.h264.encoder'"
      // "--video-codec=h265 --video-encoder='OMX.qcom.video.encoder.hevc'"
      // "--video-codec=h265 --video-encoder='c2.android.hevc.encoder'"
      options: [
        {
          label: 'Android HEVC(H.265) ',
          value: 'OMX.qcom.video.encoder.avc',
        },
        {
          label: 'Qualcomm HEVC(H.265) ',
          value: 'c2.android.avc.encoder',
        },
        {
          label: 'Google H.264(AVC)',
          value: 'OMX.google.h264.encoder',
        },
        {
          label: 'Android AVC(H.264) ',
          value: 'OMX.qcom.video.encoder.hevc',
        },
        {
          label: 'Qualcomm AVC(H.264)',
          value: 'c2.android.hevc.encoder',
        },
      ],
    },
    rotation: {
      label: 'preferences.video.screen-rotation.name',
      field: '--rotation',
      type: 'Select',
      value: '',
      placeholder: 'preferences.video.screen-rotation.placeholder',
      options: [
        { label: '0°', value: '0' },
        { label: '-90°', value: '1' },
        { label: '180°', value: '2' },
        { label: '90°', value: '3' },
      ],
    },
    crop: {
      label: 'preferences.video.screen-cropping.name',
      field: '--crop',
      type: 'Input',
      value: '',
      placeholder: 'preferences.video.screen-cropping.placeholder',
    },
    display: {
      label: 'preferences.video.multi-display.name',
      field: '--display',
      type: 'Select',
      value: '',
      placeholder: 'preferences.video.multi-display.placeholder',
      options: [
        { label: '0', value: '0' },
        { label: '1', value: '1' },
        { label: '2', value: '2' },
      ],
      props: {
        filterable: true,
        allowCreate: true,
      },
    },
    displayBuffer: {
      label: 'preferences.video.video-buffer.name',
      field: '--display-buffer',
      type: 'Input.number',
      value: '',
      placeholder: 'preferences.video.video-buffer.placeholder',
    },
    v4l2Buffer: {
      label: 'preferences.video.receiver-buffer.name',
      field: '--v4l2-buffer',
      type: 'Input.number',
      value: '',
      placeholder: 'preferences.video.receiver-buffer.placeholder',
    },
    noVideo: {
      label: 'preferences.video.disable.name',
      field: '--no-video',
      type: 'Switch',
      value: null,
      placeholder: 'preferences.video.disable.placeholder',
    },
  },
}
