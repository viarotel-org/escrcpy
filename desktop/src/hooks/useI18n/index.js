const language = ref(window.i18n.getCurrentLanguage())

window.i18n.onLanguageChanged((lang) => {
  language.value = lang
})

export function useI18n() {
  function t(...args) {
    language.value
    return window.i18n.t(...args)
  }

  return {
    t,
    language,
  }
}
