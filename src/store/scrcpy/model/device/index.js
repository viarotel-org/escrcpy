import { t } from '@/locales/index.js'

export default () => {
  return [
    {
      label: t('preferences.device.show-touch.name'),
      type: 'switch',
      field: '--show-touches',
      value: false,
      placeholder: t('preferences.device.show-touch.placeholder'),
      tips: t('preferences.device.show-touch.tips'),
    },
    {
      label: t('preferences.device.stay-awake.name'),
      type: 'switch',
      field: '--stay-awake',
      value: false,
      placeholder: t('preferences.device.stay-awake.placeholder'),
      tips: t('preferences.device.stay-awake.tips'),
    },
    {
      label: t('preferences.device.control-in-close-screen.name'),
      type: 'switch',
      field: '--turn-screen-off',
      value: false,
      placeholder: t('preferences.device.control-in-close-screen.placeholder'),
    },
    {
      label: t('preferences.device.control-end-video.name'),
      type: 'switch',
      field: '--power-off-on-close',
      value: false,
      placeholder: t('preferences.device.control-end-video.placeholder'),
    },
    {
      label: t('preferences.device.control-in-stop-charging.name'),
      type: 'switch',
      field: '--no-power-on',
      value: false,
      placeholder: t('preferences.device.control-in-stop-charging.placeholder'),
      tips: t('preferences.device.control-in-stop-charging.tips'),
    },
  ]
}
