export function useStartApp() {
  const deviceStore = useDeviceStore()
  const preferenceStore = usePreferenceStore()
  const loading = ref(false)
  const env = getEnv()

  function getEnv() {
    return window.electron.process.env
  }

  async function open(options = {}) {
    const deviceId = options.deviceId || env.EXECUTE_ARG_DEVICE_ID
    const appName = options.appName || env.EXECUTE_ARG_APP_NAME
    const packageName = options.packageName || env.EXECUTE_ARG_PACKAGE_NAME

    if (!deviceId) {
      return false
    }

    loading.value = true

    await window.adb.waitForDevice(deviceId)

    const title = `${appName}-${deviceStore.getLabel(deviceId, 'synergy')}`

    const commands = preferenceStore.scrcpyParameter(deviceId, {
      excludes: ['--otg', '--mouse=aoa', '--keyboard=aoa'],
    })

    await window.scrcpy.startApp(deviceId, { ...options, title, commands, packageName })
      .catch((e) => {
        console.error('mirror.commands', commands)
        console.error('mirror.error', e)
        if (e.message) {
          ElMessage.warning(e.message)
        }
      })

    loading.value = false
  }

  return {
    loading,
    env,
    open,
  }
}

export default useStartApp
