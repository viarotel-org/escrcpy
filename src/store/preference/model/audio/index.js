export default {
  label: 'preferences.audio.name',
  field: 'scrcpy',

  children: {
    audioSource: {
      label: 'preferences.audio.audio-source.name',
      field: '--audio-source',
      type: 'Select',
      value: '',
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
      value: '',
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
      value: '',
    },
    audioEncoder: {
      hidden: true,
      field: '--audio-encoder',
      value: '',
    },
    audioBitRate: {
      label: 'preferences.audio.audio-bit-rate.name',
      field: '--audio-bit-rate',
      type: 'Input.number',
      value: '',
      placeholder: 'preferences.audio.audio-bit-rate.placeholder',
      append: 'bps',
    },
    audioBuffer: {
      label: 'preferences.audio.audio-buffer.name',
      field: '--audio-buffer',
      type: 'Input.number',
      value: '',
      placeholder: 'preferences.audio.audio-buffer.placeholder',
      append: 'ms',
    },
    audioOutputBuffer: {
      label: 'preferences.audio.audio-output-buffer.name',
      field: '--audio-output-buffer',
      type: 'Input.number',
      value: '',
      placeholder: 'preferences.audio.audio-output-buffer.placeholder',
      append: 'ms',
    },
  },
}
