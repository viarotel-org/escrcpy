import { locale } from '$/locales/index.js'

const { adbPath, scrcpyPath, gnirehtetPath, desktopPath }
  = window?.electron?.configs || {}

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
      props: {
        clearable: false,
      },
    },
    language: {
      label: 'common.language.name',
      field: 'language',
      type: 'LanguageSelect',
      value: locale,
      placeholder: 'common.language.placeholder',
      options: [
        {
          label: 'common.language.zh-CN',
          value: 'zh-CN',
        },
        {
          label: 'common.language.zh-TW',
          value: 'zh-TW',
        },
        {
          label: 'common.language.en-US',
          value: 'en-US',
        },
        {
          label: 'common.language.ru-RU',
          value: 'ru-RU',
        },
      ],
    },
    appCloseCode: {
      label: 'appClose.name',
      field: 'appCloseCode',
      type: 'Select',
      value: window.appStore.get('common.appCloseCode') ?? -1,
      placeholder: 'common.select.please',
      options: [
        {
          label: 'appClose.question',
          value: -1,
        },
        {
          label: 'appClose.quit',
          value: 0,
        },
        {
          label: 'appClose.minimize',
          value: 1,
        },
      ],
    },
    savePath: {
      label: 'preferences.common.file.name',
      field: 'savePath',
      type: 'PathInput',
      value: desktopPath,
      placeholder: 'preferences.common.file.placeholder',
      tips: 'preferences.common.file.tips',
      properties: ['openDirectory'],
    },
    adbPath: {
      label: 'preferences.common.adb.name',
      field: 'adbPath',
      value: adbPath,
      type: 'PathInput',
      placeholder: 'preferences.common.adb.placeholder',
      tips: 'preferences.common.adb.tips',
      properties: ['openFile'],
      filters: [{ name: 'preferences.common.adb.name', extensions: ['*'] }],
    },
    gnirehtetPath: {
      label: 'preferences.common.gnirehtet.name',
      field: 'gnirehtetPath',
      value: gnirehtetPath,
      type: 'PathInput',
      placeholder: 'preferences.common.gnirehtet.placeholder',
      tips: 'preferences.common.gnirehtet.tips',
      properties: ['openFile'],
      filters: [
        { name: 'preferences.common.gnirehtet.name', extensions: ['*'] },
      ],
    },
    scrcpyPath: {
      label: 'preferences.common.scrcpy.name',
      field: 'scrcpyPath',
      value: scrcpyPath,
      type: 'PathInput',
      placeholder: 'preferences.common.scrcpy.placeholder',
      tips: 'preferences.common.scrcpy.tips',
      properties: ['openFile'],
      filters: [{ name: 'preferences.common.scrcpy.name', extensions: ['*'] }],
    },
    gnirehtetFix: {
      label: 'preferences.common.gnirehtet.fix.name',
      field: 'gnirehtetFix',
      type: 'Switch',
      value: undefined,
      placeholder: 'preferences.common.gnirehtet.fix.placeholder',
      tips: 'preferences.common.gnirehtet.fix.tips',
    },
    scrcpyAppend: {
      label: 'preferences.common.scrcpy.append.name',
      field: 'scrcpyAppend',
      value: undefined,
      type: 'Input',
      placeholder: 'preferences.common.scrcpy.append.placeholder',
      tips: 'preferences.common.scrcpy.append.tips',
      span: 24,
      props: {
        type: 'textarea',
        rows: 4,
      },
    },
    autoConnect: {
      label: 'preferences.common.auto-connect.name',
      field: 'autoConnect',
      type: 'Switch',
      value: undefined,
      placeholder: 'preferences.common.auto-connect.placeholder',
    },
    autoMirror: {
      label: 'preferences.common.auto-mirror.name',
      field: 'autoMirror',
      type: 'Switch',
      value: undefined,
      placeholder: 'preferences.common.auto-mirror.placeholder',
    },
    floatControl: {
      label: 'preferences.common.floatControl.name',
      field: 'floatControl',
      type: 'Switch',
      value: undefined,
      placeholder: 'preferences.common.floatControl.placeholder',
    },
    edgeHidden: {
      label: 'preferences.common.edgeHidden.name',
      field: 'edgeHidden',
      type: 'Switch',
      value: undefined,
      placeholder: 'preferences.common.edgeHidden.placeholder',
      tips: 'preferences.common.edgeHidden.tips',
    },
    debug: {
      label: 'preferences.common.debug.name',
      field: 'debug',
      type: 'Switch',
      value: undefined,
      placeholder: 'preferences.common.debug.placeholder',
      tips: 'preferences.common.debug.tips',
    },
  },
}
