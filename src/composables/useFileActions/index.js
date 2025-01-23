import { useDeviceStore } from '$/store'
import { allSettledWrapper } from '$/utils'
import { ElMessage } from 'element-plus'

export function useFileActions() {
  const deviceStore = useDeviceStore()

  const loading = ref(false)

  async function send(devices, options = {}) {
    if (!options.localPaths) {
      try {
        options.localPaths = await selectLocals({ openType: options.openType })
      }
      catch (error) {
        ElMessage.warning(error.message)
        return false
      }
    }

    if (Array.isArray(devices)) {
      return multipleSend(devices, options)
    }

    return singleSend(devices, options)
  }

  async function singleSend(device, options = {}) {
    options.remotePath = options.remotePath || options.savePath

    const { remotePath, silent = false, openType = 'openFile', localPaths, ...uploaderOptions } = options

    loading.value = true

    let closeLoading

    if (!silent) {
      closeLoading = ElMessage.loading(
        `${deviceStore.getLabel(device)}: ${window.t(
          'device.control.file.push.loading',
        )}`,
      ).close
    }

    try {
      const res = await window.adb.uploader({ ...uploaderOptions, deviceId: device.id, localPaths, remotePath })

      const totalCount = res.results.length
      const successCount = res.results.filter(item => item.success).length
      const failCount = totalCount - successCount

      if (!silent) {
        if (failCount) {
          ElMessage.success(
            window.t('device.control.file.push.success', {
              deviceName: deviceStore.getLabel(device),
              totalCount,
              successCount,
              failCount,
            }),
          )
        }
        else {
          ElMessage.success(
            window.t('device.control.file.push.success.single', {
              deviceName: deviceStore.getLabel(device),
            }),
          )
        }
      }
    }
    catch (error) {
      ElMessage.warning(error.message)
    }
    finally {
      loading.value = false
      closeLoading()
    }
  }

  async function multipleSend(devices, options = {}) {
    loading.value = true

    const closeMessage = ElMessage.loading(
      window.t('device.control.file.push.loading'),
    ).close

    await allSettledWrapper(devices, (item) => {
      return singleSend(item, { ...options, silent: true })
    })

    closeMessage()

    ElMessage.success(window.t('common.success.batch'))

    loading.value = false
  }

  return {
    loading,
    send,
    singleSend,
    multipleSend,
  }
}

export async function selectLocals(options = {}) {
  const { openType = 'openFile' } = options

  try {
    const files = await window.electron.ipcRenderer.invoke(
      'show-open-dialog',
      {
        properties: [openType, 'multiSelections'],
        filters: [
          {
            name: window.t('device.control.file.push.placeholder'),
            extensions: ['*'],
          },
        ],
      },
    )

    return files
  }
  catch (error) {
    const message = error.message?.match(/Error: (.*)/)?.[1] || error.message

    throw new Error(message)
  }
}
