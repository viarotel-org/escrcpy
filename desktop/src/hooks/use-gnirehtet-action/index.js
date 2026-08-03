import { sleep } from '$/utils/index.js'

export const GNIREHTET_MODES = [
  {
    label: 'device.control.gnirehtet.start',
    value: 'start',
  },
  {
    label: 'device.control.gnirehtet.stop',
    value: 'stop',
  },
]

export function useGnirehtetAction() {
  const loading = ref(false)

  async function invoke(input, options = {}) {
    const devices = Array.isArray(input) ? input : [input]
    const mode = options.mode || 'start'

    loading.value = true
    try {
      for (const device of devices.filter(Boolean)) {
        await runGnirehtet(device, mode)
      }
    }
    finally {
      loading.value = false
    }
  }

  async function runGnirehtet(device, mode) {
    const deviceId = device?.id || device

    try {
      if (mode === 'stop') {
        await window.$preload.gnirehtet.stop(deviceId)
        await sleep()
        ElMessage.success(window.t('common.success'))
        return true
      }

      await window.$preload.gnirehtet.run(deviceId)
      await sleep()
      ElMessage.success(window.t('device.control.gnirehtet.start.success'))
      return true
    }
    catch (error) {
      ElMessage.warning(error.message || 'Gnirehtet service failure')
      return false
    }
  }

  return {
    invoke,
    loading,
  }
}

export default useGnirehtetAction
