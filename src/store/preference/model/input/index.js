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
      value: undefined,
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
    keyboard: {
      label: 'preferences.input.keyboard.name',
      field: '--keyboard',
      type: 'Select',
      props: {
        clearable: true,
      },
      value: undefined,
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
      type: 'KeyboardInjectSelect',
      value: undefined,
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
      value: undefined,
    },
    videoEncoder: {
      hidden: true,
      field: '--raw-key-events',
      value: undefined,
    },
  },
}
