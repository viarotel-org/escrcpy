import { t } from '@/locales/index.js'

export default () => {
  return [
    {
      label: t('preferences.record.format.name'),
      type: 'select',
      field: '--record-format',
      value: 'mp4',
      placeholder: t('preferences.record.format.placeholder'),
      options: [
        {
          label: 'mp4',
          value: 'mp4',
        },
        {
          label: 'mkv',
          value: 'mkv',
        },
      ],
    },
  ]
}
