import messages from '@intlify/unplugin-vue-i18n/messages'
import { createI18n } from 'vue-i18n'

export const defaultLocale
  = window.appStore?.get('common.language') || window.navigator.language

export const i18n = createI18n({
  allowComposition: false,
  locale: defaultLocale,
  fallbackLocale: 'en-US',
  messages,
  fallbackWarn: false,
  missingWarn: false,
})

export const locale = i18n.global.locale

export const t = i18n.global.t
