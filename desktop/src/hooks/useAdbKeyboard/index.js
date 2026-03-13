import pLimit from 'p-limit'

export function useAdbKeyboard(options) {
  const isInstalled = ref(true)

  const devices = computed(() => {
    if (!options.devices.value) {
      return []
    }

    if (Array.isArray(options.devices.value)) {
      return options.devices.value
    }

    return [options.devices.value]
  })

  const concurrencyLimit = Number(window.$preload.store.get('common.concurrencyLimit') ?? 5)
  const limit = pLimit(concurrencyLimit)

  watch(() => devices.value, async () => {
    getInstallResults()
  }, { immediate: true })

  async function getInstallResults() {
    if (!devices.value.length) {
      return false
    }

    try {
      const tasks = devices.value.map(item =>
        limit(() => window.$preload.adb.isInstalledAdbKeyboard(item.id)),
      )

      const results = await Promise.all(tasks)

      const allInstalled = results.every(result => result)

      isInstalled.value = allInstalled

      return allInstalled
    }
    catch (error) {
      console.error(error.message)
      isInstalled.value = false
      return false
    }
  }

  async function install() {
    const tasks = devices.value.map(item =>
      limit(async () => {
        try {
          await window.$preload.adb.installAdbKeyboard(item.id)
          return true
        }
        catch (error) {
          const uploader = window.$preload.adb.uploader({ deviceId: item.id, localPaths: [window.$preload.configs.adbKeyboardApkPath] })
          uploader.start()
          return false
        }
      }),
    )

    const results = await Promise.all(tasks)

    isInstalled.value = results.every(res => res === true)

    if (!isInstalled.value) {
      ElMessage.warning({
        message: window.t('copilot.check.adb.installFailed'),
        duration: 3000,
      })
    }
  }

  return reactive({
    isInstalled,
    install,
  })
}
