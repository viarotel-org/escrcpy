export default {
  label: 'preferences.record.name',
  field: 'scrcpy',
  children: {
    recordFormat: {
      label: 'preferences.record.format.name',
      field: '--record-format',
      type: 'Select',
      value: void 0,
      placeholder: 'preferences.record.format.placeholder',
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
    lockVideoOrientation: {
      label: 'preferences.record.lock-video-orientation.name',
      field: '--lock-video-orientation',
      type: 'Select',
      value: undefined,
      placeholder: 'preferences.record.lock-video-orientation.placeholder',
      options: [
        { label: '0°', value: '0' },
        { label: '90°', value: '90' },
        { label: '180°', value: '180' },
        { label: '270°', value: '270' },
      ],
    },
    timeLimit: {
      label: 'preferences.record.time-limit.name',
      field: '--time-limit',
      type: 'InputNumber',
      value: undefined,
      placeholder: 'preferences.record.time-limit.placeholder',
      append: 's',
      span: 24,
    },
    noVideoPlayback: {
      label: 'preferences.record.no-video-playback.name',
      field: '--no-video-playback',
      type: 'Switch',
      value: undefined,
      placeholder: 'preferences.record.no-video-playback.placeholder',
      tips: 'preferences.record.no-video-playback.tips',
    },
    noAudioPlayback: {
      label: 'preferences.record.no-audio-playback.name',
      field: '--no-audio-playback',
      type: 'Switch',
      value: undefined,
      placeholder: 'preferences.record.no-audio-playback.placeholder',
      tips: 'preferences.record.no-audio-playback.tips',
    },
  },
}
