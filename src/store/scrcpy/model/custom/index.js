import { t } from '@/locales/index.js'

export default () => {
  const { adbPath, scrcpyPath, desktopPath } = window?.electron?.configs || {}

  return [
    {
      label: t('preferences.custom.file-path.name'),
      type: 'input.path',
      field: 'savePath',
      value: desktopPath,
      placeholder: t('preferences.custom.file-path.placeholder'),
      tips: t('preferences.custom.file-path.tips'),
      properties: ['openDirectory'],
    },
    {
      label: t('preferences.custom.adb-path.name'),
      field: 'adbPath',
      type: 'input.path',
      value: adbPath,
      placeholder: t('preferences.custom.adb-path.placeholder'),
      tips: t('preferences.custom.adb-path.tips'),
      properties: ['openFile'],
      filters: [
        { name: t('preferences.custom.adb-path.name'), extensions: ['*'] },
      ],
    },
    {
      label: t('preferences.custom.scrcpy-path.name'),
      field: 'scrcpyPath',
      type: 'input.path',
      value: scrcpyPath,
      placeholder: t('preferences.custom.scrcpy-path.placeholder'),
      tips: t('preferences.custom.scrcpy-path.tips'),
      properties: ['openFile'],
      filters: [
        { name: t('preferences.custom.scrcpy-path.name'), extensions: ['*'] },
      ],
    },
  ]
}
