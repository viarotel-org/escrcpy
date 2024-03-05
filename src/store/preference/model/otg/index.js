export default {
  label: 'preferences.otg.name',
  field: 'scrcpy',

  children: {
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
