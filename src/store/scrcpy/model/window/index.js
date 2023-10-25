import { t } from '@/locales/index.js'

export default () => {
  return [
    {
      label: t('preferences.window.borderless.name'),
      field: '--window-borderless',
      type: 'switch',
      value: false,
      placeholder: t('preferences.window.borderless.placeholder'),
    },
    {
      label: t('preferences.window.full-screen.name'),
      field: '--fullscreen',
      type: 'switch',
      value: false,
      placeholder: t('preferences.window.full-screen.placeholder'),
    },
    {
      label: t('preferences.window.always-top.name'),
      field: '--always-on-top',
      type: 'switch',
      value: false,
      placeholder: t('preferences.window.always-top.placeholder'),
    },
    {
      label: t('preferences.window.disable-screen-saver.name'),
      field: '--disable-screensaver',
      type: 'switch',
      value: false,
      placeholder: t('preferences.window.disable-screen-saver.placeholder'),
    },
  ]
}
