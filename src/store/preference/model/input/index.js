export default {
  label: 'preferences.input.name',
  field: 'scrcpy',

  children: {
    mouse: {
      label: 'preferences.input.mouse.name',
      field: '--mouse',
      type: 'Select',
      props: {
        clearable: true,
      },
      value: void 0,
      placeholder: 'preferences.input.mouse.placeholder',
      tips: 'preferences.input.mouse.tips',
      options: [
        {
          label: 'sdk',
          value: 'sdk',
          placeholder: 'preferences.input.mouse.options[0].placeholder',
        },
        {
          label: 'uhid',
          value: 'uhid',
          placeholder: 'preferences.input.mouse.options[1].placeholder',
        },
        {
          label: 'aoa',
          value: 'aoa',
          placeholder: 'preferences.input.mouse.options[2].placeholder',
        },
        {
          label: 'disabled',
          value: 'disabled',
          placeholder: 'preferences.input.mouse.options[3].placeholder',
        },
      ],
    },
    mouseBind: {
      field: '--mouse-bind',
      type: 'Input',
      label: 'preferences.input.mouse-bind.name',
      placeholder: 'preferences.input.mouse-bind.placeholder',
      tips: 'preferences.input.mouse-bind.tips',
      value: void 0,
    },
    keyboard: {
      label: 'preferences.input.keyboard.name',
      field: '--keyboard',
      type: 'Select',
      props: {
        clearable: true,
      },
      value: void 0,
      placeholder: 'preferences.input.keyboard.placeholder',
      tips: 'preferences.input.keyboard.tips',
      options: [
        {
          label: 'sdk',
          value: 'sdk',
          placeholder: 'preferences.input.keyboard.options[0].placeholder',
        },
        {
          label: 'uhid',
          value: 'uhid',
          placeholder: 'preferences.input.keyboard.options[1].placeholder',
        },
        {
          label: 'aoa',
          value: 'aoa',
          placeholder: 'preferences.input.keyboard.options[2].placeholder',
        },
        {
          label: 'disabled',
          value: 'disabled',
          placeholder: 'preferences.input.keyboard.options[3].placeholder',
        },
      ],
    },
    keyboardInject: {
      label: 'preferences.input.keyboard.inject.name',
      field: '--keyboard-inject',
      customized: true,
      type: 'KeyboardInjectSelect',
      value: void 0,
      placeholder: 'preferences.input.keyboard.inject.placeholder',
      tips: 'preferences.input.keyboard.inject.tips',
      options: [
        {
          label: 'default',
          value: '',
          placeholder:
            'preferences.input.keyboard.inject.options[0].placeholder',
        },
        {
          label: 'prefer-text',
          value: '--prefer-text',
          placeholder:
            'preferences.input.keyboard.inject.options[0].placeholder',
        },
        {
          label: 'raw-key-events',
          value: '--raw-key-events',
          placeholder:
            'preferences.input.keyboard.inject.options[1].placeholder',
        },
      ],
    },
    videoCodec: {
      hidden: true,
      field: '--prefer-text',
      value: void 0,
    },
    videoEncoder: {
      hidden: true,
      field: '--raw-key-events',
      value: void 0,
    },
    gamepad: {
      label: 'preferences.input.gamepad.name',
      field: '--gamepad',
      type: 'Select',
      value: void 0,
      placeholder: 'preferences.input.gamepad.placeholder',
      tips: 'preferences.input.gamepad.tips',
      options: [
        {
          label: 'disabled',
          value: '',
        },
        {
          label: 'uhid',
          value: 'uhid',
          placeholder: 'preferences.input.keyboard.options[1].placeholder',
        },
        {
          label: 'aoa',
          value: 'aoa',
          placeholder: 'preferences.input.keyboard.options[2].placeholder',
        },
      ],
    },
  },
}
