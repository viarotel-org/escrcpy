export default {
  label: 'preferences.audio.name',
  field: 'scrcpy',

  children: {
    noAudio: {
      label: 'preferences.audio.disable-audio.name',
      field: '--no-audio',
      type: 'Switch',
      value: undefined,
      placeholder: 'preferences.audio.disable-audio.placeholder',
      tips: 'preferences.audio.disable-audio.tips',
    },
    audioDup: {
      label: 'preferences.audio.audioDup.name',
      field: '--audio-dup',
      type: 'Switch',
      value: undefined,
      placeholder: 'preferences.audio.audioDup.placeholder',
      tips: 'preferences.audio.audioDup.tips',
    },
    audioSource: {
      label: 'preferences.audio.audio-source.name',
      field: '--audio-source',
      type: 'Select',
      value: undefined,
      placeholder: 'preferences.audio.audio-source.placeholder',
      tips: 'preferences.audio.audio-source.tips',
      options: [
        { label: 'preferences.audio.audio-source.output', value: '' },
        { label: 'preferences.audio.audio-source.mic', value: 'mic' },
      ],
    },
    audioCode: {
      label: 'preferences.audio.audio-code.name',
      field: '--audio-code',
      type: 'AudioCodecSelect',
      value: undefined,
      placeholder: 'preferences.audio.audio-code.placeholder',
      options: [
        {
          label: 'opus & c2.android.opus.encoder',
          value: 'opus & c2.android.opus.encoder',
        },
        {
          label: 'aac & c2.android.aac.encoder',
          value: 'aac & c2.android.aac.encoder',
        },
        {
          label: 'aac & OMX.google.aac.encoder',
          value: 'aac & OMX.google.aac.encoder',
        },
        { label: 'raw', value: 'raw' },
      ],
    },
    audioCodec: {
      hidden: true,
      field: '--audio-codec',
      value: undefined,
    },
    audioEncoder: {
      hidden: true,
      field: '--audio-encoder',
      value: undefined,
    },
    audioBitRate: {
      label: 'preferences.audio.audio-bit-rate.name',
      field: '--audio-bit-rate',
      type: 'Input',
      value: undefined,
      placeholder: 'preferences.audio.audio-bit-rate.placeholder',
      append: 'bps',
    },
    audioBuffer: {
      label: 'preferences.audio.audio-buffer.name',
      field: '--audio-buffer',
      type: 'InputNumber',
      value: undefined,
      placeholder: 'preferences.audio.audio-buffer.placeholder',
      append: 'ms',
    },
    audioOutputBuffer: {
      label: 'preferences.audio.audio-output-buffer.name',
      field: '--audio-output-buffer',
      type: 'InputNumber',
      value: undefined,
      placeholder: 'preferences.audio.audio-output-buffer.placeholder',
      append: 'ms',
    },
  },
}
