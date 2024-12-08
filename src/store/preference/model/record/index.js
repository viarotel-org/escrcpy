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
    audioRecordFormat: {
      label: 'preferences.record.format.audio.name',
      field: '--audio-record-format',
      customized: true,
      type: 'Select',
      value: void 0,
      placeholder: 'preferences.record.format.audio.placeholder',
      options: [
        {
          label: 'opus',
          value: 'opus',
        },
        {
          label: 'wav',
          value: 'wav',
        },
        {
          label: 'mka',
          value: 'mka',
        },
        {
          label: 'flac',
          value: 'flac',
        },
        {
          label: 'aac',
          value: 'aac',
        },
        {
          label: 'm4a',
          value: 'm4a',
        },
      ],
    },
    recordOrientation: {
      label: 'preferences.record.orientation.name',
      field: '--record-orientation',
      type: 'Select',
      value: undefined,
      placeholder: 'preferences.record.orientation.placeholder',
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
