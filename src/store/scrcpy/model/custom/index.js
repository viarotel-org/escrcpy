import { t } from '@/locales/index.js'

export default () => {
  const { adbPath, scrcpyPath, desktopPath } = window?.electron?.configs || {}

  return [
    {
      label: t('preferences.common.file.name'),
      type: 'input.path',
      field: 'savePath',
      value: desktopPath,
      placeholder: t('preferences.common.file.placeholder'),
      tips: t('preferences.common.file.tips'),
      properties: ['openDirectory'],
    },
    {
      label: t('preferences.common.adb.name'),
      field: 'adbPath',
      type: 'input.path',
      value: adbPath,
      placeholder: t('preferences.common.adb.placeholder'),
      tips: t('preferences.common.adb.tips'),
      properties: ['openFile'],
      filters: [{ name: t('preferences.common.adb.name'), extensions: ['*'] }],
    },
    {
      label: t('preferences.common.scrcpy.name'),
      field: 'scrcpyPath',
      type: 'input.path',
      value: scrcpyPath,
      placeholder: t('preferences.common.scrcpy.placeholder'),
      tips: t('preferences.common.scrcpy.tips'),
      properties: ['openFile'],
      filters: [
        { name: t('preferences.common.scrcpy.name'), extensions: ['*'] },
      ],
    },
  ]
}
