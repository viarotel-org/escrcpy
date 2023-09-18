export default () => {
  // "[server] INFO: List of audio encoders:"
  // "--audio-codec=opus --audio-encoder='c2.android.opus.encoder'"
  // "--audio-codec=aac --audio-encoder='c2.android.aac.encoder'"
  // "--audio-codec=aac --audio-encoder='OMX.google.aac.encoder'"
  return [
    {
      label: '禁用音频',
      field: '--no-audio',
      type: 'switch',
      value: false,
      placeholder: '开启后将禁用音频功能',
    },
  ]
}
