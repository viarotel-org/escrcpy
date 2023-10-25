import { t } from '@/locales/index.js'

export default () => {
  const { adbPath, scrcpyPath, desktopPath } = window?.electron?.configs || {}

  return [
    {
      label: t('preferences.custom.file.name'),
      type: 'input.path',
      field: 'savePath',
      value: desktopPath,
      placeholder: t('preferences.custom.file.placeholder'),
      tips: t('preferences.custom.file.tips'),
      properties: ['openDirectory'],
    },
    {
      label: t('preferences.custom.adb.name'),
      field: 'adbPath',
      type: 'input.path',
      value: adbPath,
      placeholder: t('preferences.custom.adb.placeholder'),
      tips: t('preferences.custom.adb.tips'),
      properties: ['openFile'],
      filters: [{ name: t('preferences.custom.adb.name'), extensions: ['*'] }],
    },
    {
      label: t('preferences.custom.scrcpy.name'),
      field: 'scrcpyPath',
      type: 'input.path',
      value: scrcpyPath,
      placeholder: t('preferences.custom.scrcpy.placeholder'),
      tips: t('preferences.custom.scrcpy.tips'),
      properties: ['openFile'],
      filters: [
        { name: t('preferences.custom.scrcpy.name'), extensions: ['*'] },
      ],
    },
  ]
}
