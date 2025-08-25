import { defineStore } from 'pinia'

export const useThemeStore = defineStore('app-theme', () => {
  const value = ref(window.appStore.get('common.theme') || 'system')
  const isDark = ref(window.appStore.get('common.isDark') || false)

  async function init(changeValue = value.value) {
    value.value = changeValue

    await invokeAppTheme('update', changeValue)

    isDark.value = await invokeAppTheme('isDark')
    window.appStore.set('common.isDark', isDark.value)

    await updateHtml(changeValue)
  }

  function setupWatcher() {
    window.appStore.onDidChange('common.theme', (_value) => {
      if (value.value === _value) {
        updateHtml(_value)
        return false
      }

      init(_value)
    })

    window.appStore.onDidChange('common.isDark', (_value) => {
      if (isDark.value === _value) {
        return false
      }

      init()
    })
  }

  async function updateHtml(value) {
    const updateClass = (theme) => {
      const htmlEl = document.querySelector('html')
      if (theme === 'dark') {
        htmlEl.classList.add('dark')
        return
      }

      htmlEl.classList.remove('dark')
    }

    if (value === 'system') {
      updateClass(isDark.value ? 'dark' : 'light')
      return
    }

    updateClass(value)
  }

  init()
  setupWatcher()

  return {
    value,
    isDark,
    init,
    update: init,
  }
})

function invokeAppTheme(key, value) {
  return window.electron.ipcRenderer.invoke(`app-theme-${key}`, value)
}
