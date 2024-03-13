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
    const themeValue = window.appStore.get('common.theme') || 'system'
    return {
      value: themeValue,
      isDark: false,
    }
  },
  actions: {
    system: systemTheme,

    init() {
      this.update(this.value)
    },

    async update(value) {
      this.value = value

      this.isDark = await systemTheme('isDark')

      await systemTheme('update', value)

      this.isDark = await systemTheme('isDark')

      await this.updateHtml(value)
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
        updateClass(this.isDark ? 'dark' : 'light')
        return
      }

      updateClass(value)
    },
  },
})

/** 监听系统主题色变化 */
systemTheme('change', async ({ isDark, value }) => {
  if (value !== 'system') {
    return
  }

  const themeStore = useThemeStore()

  if (themeStore.isDark === isDark) {
    return
  }

  themeStore.update(value)
})
