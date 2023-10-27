export default {
  label: 'preferences.audio.name',
  field: 'scrcpy',

  children: {
    noAudio: {
      // "[server] INFO: List of audio encoders:"
      // "--audio-codec=opus --audio-encoder='c2.android.opus.encoder'"
      // "--audio-codec=aac --audio-encoder='c2.android.aac.encoder'"
      // "--audio-codec=aac --audio-encoder='OMX.google.aac.encoder'"
      label: 'preferences.audio.disable.name',
      field: '--no-audio',
      type: 'Switch',
      value: null,
      placeholder: 'preferences.audio.disable.placeholder',
    },
  },
}
