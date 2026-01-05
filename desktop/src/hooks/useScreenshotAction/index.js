import { allSettledWrapper } from '$/utils/index.js'
import { adaptiveMessage } from '$/utils/modal/index.js'

export function useScreenshotAction({ floating } = {}) {
  const deviceStore = useDeviceStore()
  const preferenceStore = usePreferenceStore()

  const loading = ref(false)

  function invoke(...args) {
    const [devices] = args

    if (Array.isArray(devices)) {
      return multipleInvoke(...args)
    }

    return singleInvoke(...args)
  }

  async function singleInvoke(device, { silent = false } = {}) {
    let closeLoading

    if (!silent && !floating) {
      closeLoading = ElMessage.loading(
        window.t('device.control.capture.progress', {
          deviceName: deviceStore.getLabel(device),
        }),
      ).close
    }

    const fileName = `${deviceStore.getLabel(
      device,
      'screenshot',
    )}.jpg`

    const deviceConfig = preferenceStore.getData(device.id)
    const savePath = window.nodePath.resolve(deviceConfig.savePath, fileName)

    try {
      await window.adb.screencap(device.id, { savePath })
      window.electron.ipcRenderer.invoke('copy-file-to-clipboard', savePath)
    }
    catch (error) {
      if (error.message) {
        ElMessage.warning(error.message)
      }
      return false
    }

    if (silent) {
      return false
    }

    closeLoading?.()

    const successMessage = `${window.t(
      'device.control.capture.success.message.title',
    )}: ${savePath}`

    adaptiveMessage(successMessage, { type: 'success', system: floating })
  }

  async function multipleInvoke(devices) {
    loading.value = true

    const closeMessage = ElMessage.loading(
      window.t('device.control.capture.progress', {
        deviceName: window.t('common.device'),
      }),
    ).close

    await allSettledWrapper(devices, (item) => {
      return singleInvoke(item, { silent: true })
    })

    closeMessage()

    ElMessage.success(window.t('common.success.batch'))

    loading.value = false
  }

  return {
    invoke,
    loading,
    singleInvoke,
    multipleInvoke,
  }
}

export default useScreenshotAction
