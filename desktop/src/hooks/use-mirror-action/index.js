import { sleep } from '$/utils/index.js'

export function useMirrorAction() {
  const deviceStore = useDeviceStore()
  const preferenceStore = usePreferenceStore()

  const loading = ref(false)

  async function invoke(device, { ...options } = {}) {
    const devices = Array.isArray(device) ? device : [device]

    loading.value = true

    for (let index = 0; index < devices.length; index++) {
      const item = devices[index]
      await startMirror(item, { ...options, resolveOnReady: true })
      await sleep()
    }

    loading.value = false
  }

  async function startMirror(item, options) {
    const deviceId = item?.id || item

    const args = preferenceStore.scrcpyParameter(deviceId)

    const mirroring = window.$preload.scrcpy.mirror(deviceId, {
      title: deviceStore.getLabel(deviceId, 'mirror'),
      args,
      ...options,
    })

    try {
      await mirroring
    }
    catch (error) {
      console.error('useMirrorAction.mirror.args', args)
      console.error('useMirrorAction.mirror.error', error)
    }
  }

  return {
    loading,
    invoke,
  }
}

export default useMirrorAction
