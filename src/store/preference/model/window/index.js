export default {
  label: 'preferences.window.name',
  field: 'scrcpy',

  children: {
    windowBorderless: {
      label: 'preferences.window.borderless.name',
      field: '--window-borderless',
      type: 'Switch',
      value: null,
      placeholder: 'preferences.window.borderless.placeholder',
    },
    fullscreen: {
      label: 'preferences.window.full-screen.name',
      field: '--fullscreen',
      type: 'Switch',
      value: null,
      placeholder: 'preferences.window.full-screen.placeholder',
    },
    alwaysOnTop: {
      label: 'preferences.window.always-top.name',
      field: '--always-on-top',
      type: 'Switch',
      value: null,
      placeholder: 'preferences.window.always-top.placeholder',
    },
    disableScreensaver: {
      label: 'preferences.window.disable-screen-saver.name',
      field: '--disable-screensaver',
      type: 'Switch',
      value: null,
      placeholder: 'preferences.window.disable-screen-saver.placeholder',
    },
  },
}
