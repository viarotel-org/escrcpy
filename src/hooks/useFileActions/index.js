import { allSettledWrapper } from '$/utils'

export function useFileActions() {
  const deviceStore = useDeviceStore()

  const loading = ref(false)

  async function send(devices, options = {}) {
    if (!options.localPaths) {
      try {
        options.localPaths = await selectFiles({ openType: options.openType })
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

    let messageLoading

    const messageText = `${deviceStore.getLabel(device)}: ${window.t(
      'device.control.file.push.loading',
    )}`

    const onProgress = ({ total }) => {
      messageLoading?.update?.(`${messageText}(${total.percent}%)`)
    }

    const uploader = window.adb.uploader({ deviceId: device.id, localPaths, remotePath, onProgress, ...uploaderOptions })

    if (!silent) {
      messageLoading = useMessageLoading(messageText, {
        showClose: true,
        onCancel: () => {
          uploader.cancel()
        },
      })
    }

    try {
      const res = await uploader.start()

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
      messageLoading?.close?.()
    }
  }

  async function multipleSend(devices, options = {}) {
    loading.value = true

    const messageText = window.t('device.control.file.push.loading')
    const totalDevices = devices.length
    let completedDevices = 0
    let currentProgress = 0

    let cancelFlag = false

    const messageLoading = useMessageLoading(messageText, {
      showClose: true,
      onCancel: () => {
        cancelFlag = true
      },
    })

    const onDeviceProgress = (progress) => {
      const deviceWeight = 1 / totalDevices
      const deviceProgress = progress?.total?.percent || 1
      currentProgress = ((completedDevices / totalDevices) + (deviceProgress / 100 * deviceWeight)) * 100
      messageLoading.update(`${messageText}(${Math.floor(currentProgress)}%)`)
    }

    await allSettledWrapper(devices, async (item, index) => {
      if (cancelFlag) {
        return
      }

      await singleSend(item, {
        ...options,
        silent: true,
        onProgress: onDeviceProgress,
      })

      completedDevices++

      onDeviceProgress({ total: { percent: 100 } })
    })

    messageLoading.close()

    if (!cancelFlag) {
      ElMessage.success(window.t('common.success.batch'))
    }

    loading.value = false
  }

  return {
    loading,
    send,
    singleSend,
    multipleSend,
  }
}

export async function selectFiles(options = {}) {
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
