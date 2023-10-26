import { t } from '@/locales/index.js'

export default {
  label: t('preferences.device.name'),
  field: 'scrcpy',
  children: () => {
    return [
      {
        label: t('preferences.device.show-touch.name'),
        field: '--show-touches',
        type: 'Switch',
        value: false,
        placeholder: t('preferences.device.show-touch.placeholder'),
        tips: t('preferences.device.show-touch.tips'),
      },
      {
        label: t('preferences.device.stay-awake.name'),
        field: '--stay-awake',
        type: 'Switch',
        value: false,
        placeholder: t('preferences.device.stay-awake.placeholder'),
        tips: t('preferences.device.stay-awake.tips'),
      },
      {
        label: t('preferences.device.control-in-close-screen.name'),
        field: '--turn-screen-off',
        type: 'Switch',
        value: false,
        placeholder: t(
          'preferences.device.control-in-close-screen.placeholder',
        ),
      },
      {
        label: t('preferences.device.control-end-video.name'),
        field: '--power-off-on-close',
        type: 'Switch',
        value: false,
        placeholder: t('preferences.device.control-end-video.placeholder'),
      },
      {
        label: t('preferences.device.control-in-stop-charging.name'),
        field: '--no-power-on',
        type: 'Switch',
        value: false,
        placeholder: t(
          'preferences.device.control-in-stop-charging.placeholder',
        ),
        tips: t('preferences.device.control-in-stop-charging.tips'),
      },
    ]
  },
}
