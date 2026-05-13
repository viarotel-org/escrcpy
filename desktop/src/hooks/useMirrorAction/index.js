import pLimit from 'p-limit'
import { sleep } from '$/utils'

const MIRROR_START_INTERVAL = 500

export function useMirrorAction() {
  const deviceStore = useDeviceStore()
  const preferenceStore = usePreferenceStore()

  const loading = ref(false)

  async function invoke(device, { ...options } = {}) {
    const devices = Array.isArray(device) ? device : [device]
    const concurrencyLimit = Number(window.$preload.store.get('common.concurrencyLimit') ?? 5)
    const limit = pLimit(concurrencyLimit)

    loading.value = true

    try {
      const tasks = devices.map(item =>
        limit(() => startMirror(item, options)),
      )

      await Promise.allSettled(tasks)
    }
    finally {
      loading.value = false
    }
  }

  async function startMirror(item, options) {
    const deviceId = item?.id || item

    const args = preferenceStore.scrcpyParameter(deviceId, {
      excludes: ['--otg', '--mouse=aoa', '--keyboard=aoa'],
    })

    const mirroring = window.$preload.scrcpy.mirror(deviceId, {
      title: deviceStore.getLabel(deviceId, 'mirror'),
      args,
      ...options,
    })

    mirroring?.catch?.((error) => {
      console.error('useMirrorAction.mirror.args', args)
      console.error('useMirrorAction.mirror.error', error)
    })

    await sleep(MIRROR_START_INTERVAL)
  }

  return {
    loading,
    invoke,
  }
}

export default useMirrorAction
