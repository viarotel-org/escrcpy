export function useConfigFile() {
  async function importConfig(options) {
    try {
      await window.$preload.ipcRenderer.invoke('show-open-dialog', {
        preset: 'replaceFile',
        filePath: window.$preload.store.getPath(),
        filters: [
          {
            name: window.t('preferences.config.import.placeholder'),
            extensions: ['json'],
          },
        ],
      })

      try {
        options?.onSuccess?.()
      }
      catch (callbackError) {
        console.error('[useConfigFile] onSuccess callback failed:', callbackError)
      }

      ElMessage.success(window.t('preferences.config.import.success'))
    }
    catch (error) {
      if (error.message) {
        const message = error.message?.match(/Error: (.*)/)?.[1]
        ElMessage.warning(message || error.message)
      }
    }
  }

  function editConfig() {
    window.$preload.store.openInEditor()
  }

  async function exportConfig() {
    const message = ElMessage.loading(
      window.t('preferences.config.export.message'),
    )

    try {
      await window.$preload.ipcRenderer.invoke('show-save-dialog', {
        defaultPath: 'escrcpy-configs.json',
        filePath: window.$preload.store.getPath(),
        filters: [
          {
            name: window.t('preferences.config.export.placeholder'),
            extensions: ['json'],
          },
        ],
      })

      ElMessage.success(window.t('preferences.config.export.success'))
    }
    catch (error) {
      if (error.message) {
        const message = error.message?.match(/Error: (.*)/)?.[1]
        ElMessage.warning(message || error.message)
      }
    }

    message.close()
  }

  return {
    importConfig,
    editConfig,
    exportConfig,
  }
}
