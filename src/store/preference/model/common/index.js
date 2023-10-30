const { adbPath, scrcpyPath, gnirehtetPath, desktopPath }
  = window?.electron?.configs || {}

const defaultLanguage = window.electron?.process?.env?.LOCALE

export default {
  label: 'preferences.common.name',
  field: 'common',

  children: {
    theme: {
      label: 'preferences.common.theme.name',
      field: 'theme',
      type: 'Select',
      value: 'system',
      placeholder: 'preferences.common.theme.placeholder',
      tips: '',
      options: [
        {
          label: 'preferences.common.theme.options[0]',
          value: 'light',
        },
        {
          label: 'preferences.common.theme.options[1]',
          value: 'dark',
        },
        {
          label: 'preferences.common.theme.options[2]',
          value: 'system',
        },
      ],
    },
    language: {
      label: 'preferences.common.language.name',
      field: 'language',
      type: 'LanguageSelect',
      value: defaultLanguage,
      placeholder: 'preferences.common.language.placeholder',
      tips: '',
      options: [
        {
          label: 'preferences.common.language.chinese',
          value: 'zh_CN',
        },
        {
          label: 'preferences.common.language.english',
          value: 'en_US',
        },
      ],
    },
    savePath: {
      label: 'preferences.common.file.name',
      field: 'savePath',
      type: 'Input.path',
      value: desktopPath,
      placeholder: 'preferences.common.file.placeholder',
      tips: 'preferences.common.file.tips',
      properties: ['openDirectory'],
    },
    adbPath: {
      label: 'preferences.common.adb.name',
      field: 'adbPath',
      value: adbPath,
      type: 'Input.path',
      placeholder: 'preferences.common.adb.placeholder',
      tips: 'preferences.common.adb.tips',
      properties: ['openFile'],
      filters: [{ name: 'preferences.common.adb.name', extensions: ['*'] }],
    },
    scrcpyPath: {
      label: 'preferences.common.scrcpy.name',
      field: 'scrcpyPath',
      value: scrcpyPath,
      type: 'Input.path',
      placeholder: 'preferences.common.scrcpy.placeholder',
      tips: 'preferences.common.scrcpy.tips',
      properties: ['openFile'],
      filters: [{ name: 'preferences.common.scrcpy.name', extensions: ['*'] }],
    },
    gnirehtetPath: {
      label: 'preferences.common.gnirehtet.name',
      field: 'gnirehtetPath',
      value: gnirehtetPath,
      type: 'Input.path',
      placeholder: 'preferences.common.gnirehtet.placeholder',
      tips: 'preferences.common.gnirehtet.tips',
      properties: ['openFile'],
      filters: [
        { name: 'preferences.common.gnirehtet.name', extensions: ['*'] },
      ],
    },
    debug: {
      label: 'preferences.common.debug.name',
      field: 'debug',
      type: 'Switch',
      value: false,
      placeholder: 'preferences.common.debug.placeholder',
      tips: 'preferences.common.debug.tips',
    },
  },
}
