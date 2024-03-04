export default {
  label: 'preferences.otg.name',
  field: 'scrcpy',

  children: {
    otg: {
      label: 'preferences.otg.enable.name',
      field: '--otg',
      type: 'Switch',
      value: undefined,
      placeholder: 'preferences.otg.enable.placeholder',
      tips: 'preferences.otg.enable.tips',
      hidden: true,
    },
    hidKeyboard: {
      label: 'preferences.otg.only-keyboard.name',
      field: '--hid-keyboard',
      type: 'Switch',
      value: undefined,
      placeholder: 'preferences.otg.only-keyboard.placeholder',
      tips: 'preferences.otg.only-keyboard.tips',
    },
    hidMouse: {
      label: 'preferences.otg.only-mouse.name',
      field: '--hid-mouse',
      type: 'Switch',
      value: undefined,
      placeholder: 'preferences.otg.only-mouse.placeholder',
      tips: 'preferences.otg.only-mouse.tips',
    },
  },
}
