export default {
  label: 'preferences.record.name',
  field: 'scrcpy',
  children: {
    recordFormat: {
      label: 'preferences.record.format.name',
      field: '--record-format',
      type: 'Select',
      value: 'mp4',
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
      value: '',
      placeholder: 'preferences.record.lock-video-orientation.placeholder',
      options: [
        { label: '0°', value: '0' },
        { label: '-90°', value: '1' },
        { label: '180°', value: '2' },
        { label: '90°', value: '3' },
      ],
    },
    // noVideo: {
    //   label: 'preferences.record.disable-video.name',
    //   field: '--no-video',
    //   type: 'Switch',
    //   value: null,
    //   placeholder: 'preferences.record.disable-video.placeholder',
    // },
    noAudio: {
      label: 'preferences.record.disable-audio.name',
      field: '--no-audio',
      type: 'Switch',
      value: null,
      placeholder: 'preferences.record.disable-audio.placeholder',
    },
    // noVideoPlayback: {
    //   label: 'preferences.record.no-video-playback.name',
    //   field: '--no-video-playback',
    //   type: 'Switch',
    //   value: null,
    //   placeholder: 'preferences.record.no-video-playback.placeholder',
    //   tips: 'preferences.record.no-video-playback.tips',
    // },
    noAudioPlayback: {
      label: 'preferences.record.no-audio-playback.name',
      field: '--no-audio-playback',
      type: 'Switch',
      value: null,
      placeholder: 'preferences.record.no-audio-playback.placeholder',
      tips: 'preferences.record.no-audio-playback.tips',
    },
  },
}
