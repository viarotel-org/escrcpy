import { useDeviceStore } from '$/store'
import { allSettledWrapper } from '$/utils'
import { ElMessage } from 'element-plus'

export function useFileActions() {
  const deviceStore = useDeviceStore()

  const loading = ref(false)

  function send(...args) {
    const [devices] = args

    if (Array.isArray(devices)) {
      return multipleSend(...args)
    }

    return singleSend(...args)
  }

  async function selectFiles() {
    try {
      const files = await window.electron.ipcRenderer.invoke(
        'show-open-dialog',
        {
          properties: ['openFile', 'multiSelections'],
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

  async function singleSend(device, { savePath, files, silent = false } = {}) {
    if (!files) {
      try {
        files = await selectFiles()
      }
      catch (error) {
        ElMessage.warning(error.message)

        return false
      }
    }

    loading.value = true

    let closeLoading

    if (!silent) {
      closeLoading = ElMessage.loading(
        `${deviceStore.getLabel(device)}: ${window.t(
          'device.control.file.push.loading',
        )}`,
      ).close
    }

    let failCount = 0

    await allSettledWrapper(files, (item) => {
      return window.adbkit.push(device.id, item, { savePath }).catch(() => {
        ++failCount
      })
    })

    loading.value = false

    if (silent) {
      return false
    }

    const totalCount = files.length
    const successCount = totalCount - failCount

    if (successCount) {
      closeLoading()

      if (totalCount > 1) {
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

      return false
    }

    closeLoading()
    ElMessage.warning(window.t('device.control.file.push.error'))
  }

  async function multipleSend(devices, { files } = {}) {
    if (!files) {
      try {
        files = await selectFiles()
      }
      catch (error) {
        ElMessage.warning(error.message)

        return false
      }
    }

    loading.value = true

    const closeMessage = ElMessage.loading(
      window.t('device.control.file.push.loading'),
    ).close

    await allSettledWrapper(devices, (item) => {
      return singleSend(item, { files, silent: true })
    })

    closeMessage()

    ElMessage.success(window.t('common.success.batch'))

    loading.value = false
  }

  return {
    loading,
    send,
    selectFiles,
    singleSend,
    multipleSend,
  }
}
