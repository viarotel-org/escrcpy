import { t } from '@/locales/index.js'

export default {
  label: t('preferences.record.name'),
  field: 'scrcpy',
  children: () => {
    return [
      {
        label: t('preferences.record.format.name'),
        field: '--record-format',
        type: 'Select',
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
  },
}
