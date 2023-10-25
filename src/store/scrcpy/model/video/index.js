import { t } from '@/locales/index.js'

const getDisplayOptions = (display = []) =>
  display?.map(value => ({ label: value, value })) || []

export default ({ display } = {}) => {
  const displayOptions = display?.length
    ? getDisplayOptions(display)
    : [
        { label: '0', value: '0' },
        { label: '1', value: '1' },
        { label: '2', value: '2' },
      ]

  return [
    {
      label: t('preferences.video.resolution.name'),
      type: 'input.number',
      field: '--max-size',
      value: '',
      placeholder: t('preferences.video.resolution.placeholder'),
    },
    {
      label: t('preferences.video.bit.name'),
      type: 'input',
      field: '--video-bit-rate',
      value: '',
      placeholder: t('preferences.video.bit.placeholder'),
    },
    {
      label: t('preferences.video.refresh-rate.name'),
      type: 'input.number',
      field: '--max-fps',
      value: '',
      placeholder: t('preferences.video.refresh-rate.placeholder'),
    },
    {
      label: t('preferences.video.decoder.name'),
      type: 'select',
      field: '--video-codec',
      value: '',
      placeholder: t('preferences.video.decoder.placeholder'),
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
      label: t('preferences.video.encoder.name'),
      type: 'select',
      field: '--video-encoder',
      value: '',
      placeholder: t('preferences.video.encoder.placeholder'),
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
    {
      label: t('preferences.video.screen-rotation.name'),
      type: 'select',
      field: '--rotation',
      value: '',
      placeholder: t('preferences.video.screen-rotation.placeholder'),
      options: [
        { label: '0°', value: '0' },
        { label: '-90°', value: '1' },
        { label: '180°', value: '2' },
        { label: '90°', value: '3' },
      ],
    },
    {
      label: t('preferences.video.screen-cropping.name'),
      type: 'input',
      field: '--crop',
      value: '',
      placeholder: t('preferences.video.screen-cropping.placeholder'),
    },
    {
      label: t('preferences.video.multi-display.name'),
      type: 'select',
      field: '--display',
      value: '',
      placeholder: t('preferences.video.multi-display.placeholder'),
      options: displayOptions,
      props: {
        filterable: true,
        allowCreate: true,
      },
    },
    {
      label: t('preferences.video.video-buffering.name'),
      type: 'input.number',
      field: '--display-buffer',
      value: '',
      placeholder: t('preferences.video.video-buffering.placeholder'),
    },
    {
      label: t('preferences.video.audio-buffering.name'),
      type: 'input.number',
      field: '--audio-buffer',
      value: '',
      placeholder: t('preferences.video.video-buffering.placeholder'),
    },
    {
      label: t('preferences.video.receiver-buffering.name'),
      type: 'input.number',
      field: '--v4l2-buffer',
      value: '',
      placeholder: t('preferences.video.video-buffering.placeholder'),
    },
    {
      label: t('preferences.video.disable.name'),
      type: 'switch',
      field: '--no-video',
      value: false,
      placeholder: t('preferences.video.disable.placeholder'),
    },
  ]
}
