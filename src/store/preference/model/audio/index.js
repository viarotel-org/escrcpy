export default {
  label: 'preferences.audio.name',
  field: 'scrcpy',

  children: {
    audioBuffer: {
      label: 'preferences.audio.audio-buffer.name',
      field: '--audio-buffer',
      type: 'Input.number',
      value: '',
      placeholder: 'preferences.audio.audio-buffer.placeholder',
    },
    audioOutputBuffer: {
      label: 'preferences.audio.audio-output-buffer.name',
      field: '--audio-output-buffer',
      type: 'Input.number',
      value: '',
      placeholder: 'preferences.audio.audio-output-buffer.placeholder',
    },
    noAudio: {
      label: 'preferences.audio.disable.name',
      field: '--no-audio',
      type: 'Switch',
      value: null,
      placeholder: 'preferences.audio.disable.placeholder',
    },
  },
}
