export default {
  label: 'preferences.otg.name',
  field: 'scrcpy',

  children: {
    otg: {
      label: 'preferences.otg.enable.name',
      field: '--otg',
      type: 'Switch',
      value: null,
      placeholder: 'preferences.otg.enable.placeholder',
      tips: 'preferences.otg.enable.tips',
    },
    hidKeyboard: {
      label: 'preferences.otg.hid-keyboard.name',
      field: '--hid-keyboard',
      type: 'Switch',
      value: null,
      placeholder: 'preferences.otg.hid-keyboard.placeholder',
      tips: 'preferences.otg.hid-keyboard.tips',
    },
    hidMouse: {
      label: 'preferences.otg.hid-mouse.name',
      field: '--hid-mouse',
      type: 'Switch',
      value: null,
      placeholder: 'preferences.otg.hid-mouse.placeholder',
      tips: 'preferences.otg.hid-mouse.tips',
    },
  },
}
