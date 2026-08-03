export function useCameraAction() {
  const deviceStore = useDeviceStore()
  const preferenceStore = usePreferenceStore()
  const loading = ref(false)

  async function invoke(input, options = {}) {
    const devices = Array.isArray(input) ? input : [input]

    loading.value = true

    try {
      for (const device of devices.filter(Boolean)) {
        await startCamera(device, options)
      }
    }
    finally {
      loading.value = false
    }
  }

  async function startCamera(device, options = {}) {
    const deviceId = device?.id || device

    const args = preferenceStore.scrcpyParameter(deviceId, {
      overrides: {
        '--video-source': 'camera',
      },
      excludes: [
        '--mouse',
        '--keyboard',
        '--turn-screen-off',
        '--power-off-on-close',
        '--stay-awake',
        '--show-touches',
      ],
      useCamera: true,
    })

    try {
      await window.$preload.scrcpy.mirror(deviceId, {
        title: deviceStore.getLabel(device, 'camera'),
        args,
        resolveOnReady: true,
        ...options.scrcpyOptions,
      })
    }
    catch (error) {
      console.error('camera.args', args)
      console.error('camera.error', error)

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

export default useCameraAction
