export function useOtgAction() {
  const deviceStore = useDeviceStore()
  const preferenceStore = usePreferenceStore()
  const loading = ref(false)

  async function invoke(input, options = {}) {
    const devices = Array.isArray(input) ? input : [input]

    loading.value = true
    try {
      for (const device of devices.filter(Boolean)) {
        await startOtg(device, options)
      }
    }
    finally {
      loading.value = false
    }
  }

  async function startOtg(device, options = {}) {
    const deviceId = device?.id || device

    const args = preferenceStore.scrcpyParameter(deviceId, {
      overrides: {
        '--no-video': true,
        '--no-audio': true,
        '--always-on-top': true,
        '--mouse': 'uhid',
        '--keyboard': 'uhid',
      },
      excludes: [
        '--turn-screen-off',
      ],
    })

    try {
      await window.$preload.scrcpy.mirror(deviceId, {
        title: deviceStore.getLabel(device),
        args,
        resolveOnReady: true,
        ...options.scrcpyOptions,
      })
    }
    catch (error) {
      console.error('otg.args', args)
      console.error('otg.error', error)

      if (error.message) {
        ElMessage.warning(error.message)
      }
    }
  }

  const api = reactive({
    loading,
    invoke,
  })

  return api
}

export default useOtgAction
