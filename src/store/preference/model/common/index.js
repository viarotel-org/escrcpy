import { t } from '@/locales/index.js'

export default {
  label: t('preferences.common.name'),
  field: 'common',

  children: () => {
    const { adbPath, scrcpyPath, desktopPath }
      = window?.electron?.configs || {}

    return [
      {
        label: t('preferences.common.file.name'),
        field: 'savePath',
        type: 'Input.path',
        value: desktopPath,
        placeholder: t('preferences.common.file.placeholder'),
        tips: t('preferences.common.file.tips'),
        properties: ['openDirectory'],
      },
      {
        label: t('preferences.common.adb.name'),
        field: 'adbPath',
        value: adbPath,
        type: 'Input.path',
        placeholder: t('preferences.common.adb.placeholder'),
        tips: t('preferences.common.adb.tips'),
        properties: ['openFile'],
        filters: [
          { name: t('preferences.common.adb.name'), extensions: ['*'] },
        ],
      },
      {
        label: t('preferences.common.scrcpy.name'),
        field: 'scrcpyPath',
        value: scrcpyPath,
        type: 'Input.path',
        placeholder: t('preferences.common.scrcpy.placeholder'),
        tips: t('preferences.common.scrcpy.tips'),
        properties: ['openFile'],
        filters: [
          { name: t('preferences.common.scrcpy.name'), extensions: ['*'] },
        ],
      },
    ]
  },
}
