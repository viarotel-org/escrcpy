export default {
  label: 'preferences.device.name',
  field: 'scrcpy',
  children: {
    showTouches: {
      label: 'preferences.device.show-touch.name',
      field: '--show-touches',
      type: 'Switch',
      value: null,
      placeholder: 'preferences.device.show-touch.placeholder',
      tips: 'preferences.device.show-touch.tips',
    },
    stayAwake: {
      label: 'preferences.device.stay-awake.name',
      field: '--stay-awake',
      type: 'Switch',
      value: null,
      placeholder: 'preferences.device.stay-awake.placeholder',
      tips: 'preferences.device.stay-awake.tips',
    },
    turnScreenOff: {
      label: 'preferences.device.control-in-close-screen.name',
      field: '--turn-screen-off',
      type: 'Switch',
      value: null,
      placeholder: 'preferences.device.control-in-close-screen.placeholder',
    },
    powerOffOnClose: {
      label: 'preferences.device.control-end-video.name',
      field: '--power-off-on-close',
      type: 'Switch',
      value: null,
      placeholder: 'preferences.device.control-end-video.placeholder',
    },
    noPowerOn: {
      label: 'preferences.device.control-in-stop-charging.name',
      field: '--no-power-on',
      type: 'Switch',
      value: null,
      placeholder: 'preferences.device.control-in-stop-charging.placeholder',
      tips: 'preferences.device.control-in-stop-charging.tips',
    },
  },
}
