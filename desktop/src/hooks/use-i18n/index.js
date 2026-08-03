const language = ref(window.$preload.i18n.getCurrentLanguage())

window.$preload.i18n.onLanguageChanged((lang) => {
  language.value = lang
})

export function useI18n() {
  function t(...args) {
    language.value
    return window.$preload.i18n.t(...args)
  }

  return {
    t,
    language,
  }
}
