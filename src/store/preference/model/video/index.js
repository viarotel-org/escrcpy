import { t } from '@/locales/index.js'

const getDisplayOptions = (display = []) =>
  display?.map(value => ({ label: value, value })) || []

export default {
  label: t('preferences.video.name'),
  field: 'scrcpy',

  children: ({ display } = {}) => {
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
        field: '--max-size',
        type: 'Input.number',
        value: '',
        placeholder: t('preferences.video.resolution.placeholder'),
      },
      {
        label: t('preferences.video.bit.name'),
        field: '--video-bit-rate',
        type: 'Input',
        value: '',
        placeholder: t('preferences.video.bit.placeholder'),
      },
      {
        label: t('preferences.video.refresh-rate.name'),
        field: '--max-fps',
        type: 'Input.number',
        value: '',
        placeholder: t('preferences.video.refresh-rate.placeholder'),
      },
      {
        label: t('preferences.video.decoder.name'),
        field: '--video-codec',
        type: 'Select',
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
        field: '--video-encoder',
        type: 'Select',
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
        field: '--rotation',
        type: 'Select',
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
        field: '--crop',
        type: 'Input',
        value: '',
        placeholder: t('preferences.video.screen-cropping.placeholder'),
      },
      {
        label: t('preferences.video.multi-display.name'),
        field: '--display',
        type: 'Select',
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
        field: '--display-buffer',
        type: 'Input.number',
        value: '',
        placeholder: t('preferences.video.video-buffering.placeholder'),
      },
      {
        label: t('preferences.video.audio-buffering.name'),
        field: '--audio-buffer',
        type: 'Input.number',
        value: '',
        placeholder: t('preferences.video.video-buffering.placeholder'),
      },
      {
        label: t('preferences.video.receiver-buffering.name'),
        field: '--v4l2-buffer',
        type: 'Input.number',
        value: '',
        placeholder: t('preferences.video.video-buffering.placeholder'),
      },
      {
        label: t('preferences.video.disable.name'),
        field: '--no-video',
        type: 'Switch',
        value: false,
        placeholder: t('preferences.video.disable.placeholder'),
      },
    ]
  },
}
