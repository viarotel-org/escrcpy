import { defineStore } from 'pinia'

export const useThemeStore = defineStore('app-theme', () => {
  const value = ref(window.$preload.store.get('common.theme') || 'system')
  const isDark = ref(window.$preload.store.get('common.isDark') || false)

  async function init(changeValue = value.value) {
    value.value = changeValue

    await invokeAppTheme('update', changeValue)

    isDark.value = await invokeAppTheme('isDark')
    window.$preload.store.set('common.isDark', isDark.value)

    await updateHtml(changeValue)
  }

  function setupWatcher() {
    window.$preload.store.onDidChange('common.theme', (_value) => {
      if (value.value === _value) {
        updateHtml(_value)
        return false
      }

      init(_value)
    })

    window.$preload.store.onDidChange('common.isDark', (_value) => {
      if (isDark.value === _value) {
        return false
      }

      init()
    })
  }

  async function updateHtml(value) {
    if (value === 'system') {
      updateClass(isDark.value ? 'dark' : 'light')
      return
    }

    updateClass(value)
  }

  function updateClass(theme) {
    const htmlEl = document.documentElement

    if (theme === 'dark') {
      htmlEl.classList.remove('bg-gray-100')
      htmlEl.classList.add('dark', 'dark:bg-gray-900')
      return
    }

    htmlEl.classList.remove('dark', 'dark:bg-gray-900')
    htmlEl.classList.add('bg-gray-100')
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
  return window.$preload.ipcRenderer.invoke(`app-theme-${key}`, value)
}
