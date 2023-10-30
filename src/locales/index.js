import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'

const locale
  = window.appStore.get('common.language')
  || window.electron?.process?.env?.LOCALE

// const locale = 'en_US'

// console.log('locale', locale)

export const i18n = createI18n({
  allowComposition: false,
  locale,
  fallbackLocale: 'en_US',
  messages,
  fallbackWarn: false,
  missingWarn: false,
})
// console.log('i18n', i18n)

export const t = i18n.global.t
