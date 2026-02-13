import i18n from 'i18next'
import Backend from 'i18next-fs-backend'
import path from 'node:path'
import electronStore from '$electron/helpers/store/index.js'
import { localesDir } from '$electron/configs/extra/index.js'

const lng = electronStore.get('common.language') ?? process.env.APP_LOCALE ?? 'en-US'
const loadPath = path.join(localesDir, '{lng}.json')

i18n
  .use(Backend)
  .init({
    lng,
    fallbackLng: 'en-US',
    backend: {
      loadPath,
    },
    interpolation: {
      escapeValue: false,
      prefix: '{',
      suffix: '}',
    },
    returnEmptyString: false,
  })

export const t = i18n.t

electronStore.onDidChange('common.language', (val) => {
  if (i18n.language === val) {
    return
  }

  changeLanguage(val)
})

function changeLanguage(val) {
  i18n.changeLanguage(val)
}

function onLanguageChanged(callback) {
  i18n.on('languageChanged', callback)

  return () => {
    i18n.off('languageChanged', callback)
  }
}

function getCurrentLanguage() {
  return i18n.language
}

export default {
  t,
  changeLanguage,
  onLanguageChanged,
  getCurrentLanguage,
}
