import { defineStore } from 'pinia'

const systemTheme = (key, value) => {
  if (key === 'change') {
    return window.electron.ipcRenderer.on('app-theme-change', (_, ...args) =>
      value(...args),
    )
  }
  return window.electron.ipcRenderer.invoke(`app-theme-${key}`, value)
}

export const useThemeStore = defineStore({
  id: 'app-theme',
  state() {
    return {
      value: window.appStore.get('common.theme') || 'system',
    }
  },
  actions: {
    system: systemTheme,

    init() {
      this.update(this.value)
    },

    update(value) {
      this.value = value
      systemTheme('update', value)
      this.updateHtml(value)
      return true
    },

    async updateHtml(value) {
      const updateClass = (theme) => {
        const htmlEl = document.querySelector('html')
        if (theme === 'dark') {
          htmlEl.classList.add('dark')
          return
        }

        htmlEl.classList.remove('dark')
      }

      if (value === 'system') {
        const isDark = await systemTheme('isDark')
        updateClass(isDark ? 'dark' : 'light')
        return
      }

      updateClass(value)
    },
  },
})

/** 监听系统主题色变化 */
systemTheme('change', ({ value }) => {
  console.log('systemTheme.change.value', value)
  const themeStore = useThemeStore()
  if (value === 'system') {
    themeStore.update(value)
  }
})
